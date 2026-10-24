// CloudDoc AI file converter.
// Every file is read into one shared shape, then written out in the format asked for:
//   doc = { name, sections: [{ title, blocks: [{ type: 'heading'|'para'|'table', text?, rows? }] }] }
// Everything runs in the browser, so files never leave the user's computer.
// Heavy libraries load only when a conversion starts.

import { pdfToTables } from './pdfTables';

export const FORMATS = {
  pdf: { label: 'PDF', ext: 'pdf' },
  docx: { label: 'Word', ext: 'docx' },
  pptx: { label: 'PowerPoint', ext: 'pptx' },
  xlsx: { label: 'Excel', ext: 'xlsx' },
  csv: { label: 'CSV', ext: 'csv' },
  txt: { label: 'Text', ext: 'txt' },
  png: { label: 'Images (PNG, zipped)', ext: 'zip' },
};

// What each kind of input can become.
export const TARGETS = {
  pdf: ['xlsx', 'docx', 'pptx', 'png', 'txt'],
  docx: ['pdf', 'pptx', 'xlsx', 'txt'],
  pptx: ['pdf', 'docx', 'xlsx', 'txt'],
  xlsx: ['pdf', 'docx', 'pptx', 'csv'],
  image: ['pdf'],
  txt: ['pdf', 'docx', 'pptx'],
};

export const ACCEPT = '.pdf,.docx,.pptx,.xlsx,.xls,.csv,.txt,.md,.png,.jpg,.jpeg,.webp';

export function kindOf(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  if (ext === 'pptx') return 'pptx';
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'xlsx';
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'image';
  if (['txt', 'md'].includes(ext)) return 'txt';
  return null;
}

const baseName = (name) => name.replace(/\.[^.]+$/, '');

// ---------- readers ----------

let pdfjsPromise;
async function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.mjs').then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.mjs`;
      return lib;
    });
  }
  return pdfjsPromise;
}

async function openPdf(file) {
  const pdfjs = await loadPdfjs();
  return pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
}

// Consecutive multi-column lines become a table; single lines become paragraphs.
function gridToBlocks(grid) {
  const blocks = [];
  let table = null;
  grid.forEach((row) => {
    if (row.length > 1) {
      if (!table) {
        table = { type: 'table', rows: [] };
        blocks.push(table);
      }
      table.rows.push(row);
    } else {
      table = null;
      const text = String(row[0] ?? '').trim();
      if (text) blocks.push({ type: 'para', text });
    }
  });
  return blocks;
}

async function readPdf(file) {
  const pdf = await openPdf(file);
  const pages = await pdfToTables(pdf);
  return {
    name: baseName(file.name),
    sections: pages.map((grid, i) => ({ title: `Page ${i + 1}`, blocks: gridToBlocks(grid) })),
  };
}

async function readDocx(file) {
  const mammoth = (await import('mammoth/mammoth.browser')).default;
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
  const body = new DOMParser().parseFromString(html, 'text/html').body;
  const blocks = [];
  const walk = (el) => {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    if (/^h[1-6]$/.test(tag)) {
      if (text) blocks.push({ type: 'heading', level: Number(tag[1]), text });
    } else if (tag === 'table') {
      const rows = [...el.querySelectorAll('tr')].map((tr) =>
        [...tr.querySelectorAll('td,th')].map((td) => td.textContent.replace(/\s+/g, ' ').trim())
      );
      if (rows.length) blocks.push({ type: 'table', rows });
    } else if (tag === 'ul' || tag === 'ol') {
      [...el.children].forEach((li) => {
        const t = li.textContent.replace(/\s+/g, ' ').trim();
        if (t) blocks.push({ type: 'para', text: `• ${t}` });
      });
    } else if (text) {
      blocks.push({ type: 'para', text });
    }
  };
  [...body.children].forEach(walk);
  return { name: baseName(file.name), sections: [{ title: baseName(file.name), blocks }] };
}

async function readPptx(file) {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideFiles = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  const parser = new DOMParser();
  const A = 'http://schemas.openxmlformats.org/drawingml/2006/main';
  const sections = [];
  for (const [i, name] of slideFiles.entries()) {
    const xml = parser.parseFromString(await zip.file(name).async('string'), 'application/xml');
    const blocks = [];
    const inTable = new Set();
    [...xml.getElementsByTagNameNS(A, 'tbl')].forEach((tbl) => {
      const rows = [...tbl.getElementsByTagNameNS(A, 'tr')].map((tr) =>
        [...tr.getElementsByTagNameNS(A, 'tc')].map((tc) => {
          [...tc.getElementsByTagNameNS(A, 'p')].forEach((p) => inTable.add(p));
          return tc.textContent.trim();
        })
      );
      if (rows.length) blocks.push({ type: 'table', rows });
    });
    const paras = [...xml.getElementsByTagNameNS(A, 'p')]
      .filter((p) => !inTable.has(p))
      .map((p) => [...p.getElementsByTagNameNS(A, 't')].map((t) => t.textContent).join('').trim())
      .filter(Boolean);
    const title = paras[0] || `Slide ${i + 1}`;
    sections.push({
      title,
      blocks: [...paras.slice(1).map((text) => ({ type: 'para', text })), ...blocks],
    });
  }
  return { name: baseName(file.name), sections };
}

async function readSheet(file) {
  const XLSX = await import('xlsx');
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  return {
    name: baseName(file.name),
    sections: wb.SheetNames.map((sheet) => {
      const rows = XLSX.utils
        .sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '', raw: true })
        .filter((r) => r.some((c) => c !== ''));
      return { title: sheet, blocks: rows.length ? [{ type: 'table', rows }] : [] };
    }),
  };
}

async function readText(file) {
  const lines = (await file.text()).split(/\r?\n/);
  return {
    name: baseName(file.name),
    sections: [{ title: baseName(file.name), blocks: lines.map((text) => ({ type: 'para', text })) }],
  };
}

export async function readFile(file) {
  switch (kindOf(file)) {
    case 'pdf': return readPdf(file);
    case 'docx': return readDocx(file);
    case 'pptx': return readPptx(file);
    case 'xlsx': return readSheet(file);
    case 'txt': return readText(file);
    default: throw new Error('This file type is not supported yet.');
  }
}

// ---------- writers ----------

const cellText = (v) => (v === null || v === undefined ? '' : String(v));

async function writeXlsx(doc) {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  const used = new Set();
  doc.sections.forEach((section, i) => {
    const rows = [];
    section.blocks.forEach((b) => {
      if (b.type === 'table') rows.push(...b.rows, []);
      else rows.push([b.text]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows.length ? rows : [['']]);
    // widen columns to fit their longest value
    const widths = [];
    rows.forEach((r) => r.forEach((c, j) => { widths[j] = Math.min(Math.max(widths[j] || 8, cellText(c).length + 2), 60); }));
    ws['!cols'] = widths.map((wch) => ({ wch }));
    let name = (section.title || `Sheet ${i + 1}`).replace(/[\\/?*[\]:]/g, ' ').slice(0, 31).trim() || `Sheet ${i + 1}`;
    while (used.has(name)) name = `${name.slice(0, 28)} ${i + 1}`;
    used.add(name);
    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

async function writeCsv(doc) {
  const rows = doc.sections.flatMap((s) => s.blocks.flatMap((b) => (b.type === 'table' ? b.rows : [[b.text]])));
  const csv = rows
    .map((r) => r.map((c) => { const t = cellText(c); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; }).join(','))
    .join('\n');
  return new Blob([csv], { type: 'text/csv' });
}

async function writeTxt(doc) {
  const text = doc.sections
    .map((s) => s.blocks.map((b) => (b.type === 'table' ? b.rows.map((r) => r.map(cellText).join('\t')).join('\n') : b.text)).join('\n'))
    .join('\n\n');
  return new Blob([text], { type: 'text/plain' });
}

async function writeDocx(doc, { sectionHeadings }) {
  const d = await import('docx');
  const children = [];
  doc.sections.forEach((section, i) => {
    if (sectionHeadings && section.title) {
      children.push(new d.Paragraph({ text: section.title, heading: d.HeadingLevel.HEADING_1, pageBreakBefore: i > 0 }));
    } else if (i > 0) {
      children.push(new d.Paragraph({ children: [new d.PageBreak()] }));
    }
    section.blocks.forEach((b) => {
      if (b.type === 'heading') {
        const level = ['HEADING_1', 'HEADING_2', 'HEADING_3'][Math.min((b.level || 1) - 1, 2)];
        children.push(new d.Paragraph({ text: b.text, heading: d.HeadingLevel[level] }));
      } else if (b.type === 'para') {
        children.push(new d.Paragraph({ children: [new d.TextRun(b.text)] }));
      } else if (b.type === 'table') {
        const cols = Math.max(...b.rows.map((r) => r.length));
        children.push(
          new d.Table({
            width: { size: 100, type: d.WidthType.PERCENTAGE },
            rows: b.rows.map((r, ri) =>
              new d.TableRow({
                children: Array.from({ length: cols }, (_, ci) =>
                  new d.TableCell({
                    children: [new d.Paragraph({ children: [new d.TextRun({ text: cellText(r[ci]), bold: ri === 0, size: 18 })] })],
                  })
                ),
              })
            ),
          }),
          new d.Paragraph('')
        );
      }
    });
  });
  const file = new d.Document({ sections: [{ children }] });
  return d.Packer.toBlob(file);
}

async function writePdf(doc, { sectionHeadings }) {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  const wide = doc.sections.some((s) => s.blocks.some((b) => b.type === 'table' && Math.max(...b.rows.map((r) => r.length)) > 7));
  const pdf = new jsPDF({ orientation: wide ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
  const margin = 40;
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  let y = margin;
  const ensure = (h) => { if (y + h > pageH - margin) { pdf.addPage(); y = margin; } };
  doc.sections.forEach((section, i) => {
    if (i > 0) { pdf.addPage(); y = margin; }
    if (sectionHeadings && section.title) {
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(16);
      pdf.splitTextToSize(section.title, pageW - margin * 2).forEach((line) => { ensure(20); pdf.text(line, margin, y); y += 20; });
      y += 6;
    }
    section.blocks.forEach((b) => {
      if (b.type === 'table') {
        autoTable(pdf, {
          startY: y,
          head: [b.rows[0].map(cellText)],
          body: b.rows.slice(1).map((r) => r.map(cellText)),
          margin: { left: margin, right: margin },
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [79, 70, 229] },
        });
        y = pdf.lastAutoTable.finalY + 14;
      } else {
        const heading = b.type === 'heading';
        pdf.setFont('helvetica', heading ? 'bold' : 'normal');
        pdf.setFontSize(heading ? 13 : 10.5);
        const lh = heading ? 18 : 14;
        pdf.splitTextToSize(b.text || ' ', pageW - margin * 2).forEach((line) => { ensure(lh); pdf.text(line, margin, y); y += lh; });
        y += heading ? 4 : 2;
      }
    });
  });
  return pdf.output('blob');
}

async function writePptx(doc) {
  const PptxGenJS = (await import('pptxgenjs')).default;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  const addSlide = (title) => {
    const slide = pptx.addSlide();
    slide.addText(title, { x: 0.5, y: 0.3, w: 12.3, h: 0.8, fontSize: 26, bold: true, color: '1E1B4B' });
    return slide;
  };
  // Single-section docs (Word, text) start a new slide at each heading.
  const sections = doc.sections.length === 1
    ? doc.sections[0].blocks.reduce((acc, b) => {
        if (b.type === 'heading' || !acc.length) acc.push({ title: b.type === 'heading' ? b.text : doc.name, blocks: [] });
        if (b.type !== 'heading') acc[acc.length - 1].blocks.push(b);
        return acc;
      }, [])
    : doc.sections;
  sections.forEach((section) => {
    let lines = [];
    const flush = () => {
      if (!lines.length) return;
      for (let i = 0; i < lines.length; i += 8) {
        addSlide(section.title).addText(
          lines.slice(i, i + 8).map((t) => ({ text: t.replace(/^•\s*/, ''), options: { bullet: true, breakLine: true } })),
          { x: 0.6, y: 1.3, w: 12.1, h: 5.6, fontSize: 18, valign: 'top', fit: 'shrink' }
        );
      }
      lines = [];
    };
    section.blocks.forEach((b) => {
      if (b.type === 'table') {
        flush();
        const cols = Math.max(...b.rows.map((r) => r.length));
        for (let i = 1; i < Math.max(b.rows.length, 2); i += 12) {
          const rows = [b.rows[0], ...b.rows.slice(i, i + 12)].map((r) =>
            Array.from({ length: cols }, (_, ci) => ({ text: cellText(r[ci]) }))
          );
          addSlide(section.title).addTable(rows, { x: 0.4, y: 1.2, w: 12.5, fontSize: cols > 8 ? 8 : 11, border: { color: 'CBD5E1', pt: 0.5 }, autoPage: false });
        }
      } else if (b.text && b.text.trim()) {
        lines.push(b.text.trim());
      }
    });
    flush();
    if (!section.blocks.length) addSlide(section.title);
  });
  return pptx.write({ outputType: 'blob' });
}

async function pdfToImages(file) {
  const JSZip = (await import('jszip')).default;
  const pdf = await openPdf(file);
  const zip = new JSZip();
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    zip.file(`${baseName(file.name)}-page-${p}.png`, blob);
  }
  return zip.generateAsync({ type: 'blob' });
}

async function imagesToPdf(files) {
  const { jsPDF } = await import('jspdf');
  let pdf = null;
  for (const file of files) {
    const url = URL.createObjectURL(file);
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const orientation = img.width > img.height ? 'landscape' : 'portrait';
    if (!pdf) pdf = new jsPDF({ orientation, unit: 'pt', format: 'a4' });
    else pdf.addPage('a4', orientation);
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const scale = Math.min((pw - 40) / img.width, (ph - 40) / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', (pw - w) / 2, (ph - h) / 2, w, h);
    URL.revokeObjectURL(url);
  }
  return pdf.output('blob');
}

// Convert the given files (one, or several images) to the target format.
// Returns { blob, filename, doc } where doc is the extracted content (for previews).
export async function convert(files, target) {
  const first = files[0];
  const kind = kindOf(first);
  const ext = FORMATS[target].ext;
  if (kind === 'image') {
    return { blob: await imagesToPdf(files), filename: `${baseName(first.name)}.pdf`, doc: null };
  }
  if (kind === 'pdf' && target === 'png') {
    return { blob: await pdfToImages(first), filename: `${baseName(first.name)}-pages.zip`, doc: null };
  }
  const doc = await readFile(first);
  const sectionHeadings = kind === 'pptx' || kind === 'xlsx';
  const writers = { xlsx: writeXlsx, csv: writeCsv, txt: writeTxt, docx: writeDocx, pdf: writePdf, pptx: writePptx };
  const blob = await writers[target](doc, { sectionHeadings });
  return { blob, filename: `${doc.name}.${ext}`, doc };
}

// Plain text of any supported document, for AI analysis.
export async function extractText(file) {
  const kind = kindOf(file);
  if (!kind || kind === 'image') return '';
  const doc = await readFile(file);
  return doc.sections
    .map((s) => {
      const body = s.blocks
        .map((b) => (b.type === 'table' ? b.rows.map((r) => r.map(cellText).join(' | ')).join('\n') : b.text))
        .join('\n');
      return doc.sections.length > 1 ? `## ${s.title}\n${body}` : body;
    })
    .join('\n\n')
    .trim();
}
