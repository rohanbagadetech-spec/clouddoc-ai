// Turns the text of each PDF page into rows and columns, so tables in a PDF
// land in real spreadsheet cells. Works with any pdf.js `getDocument` result.

const ROW_TOLERANCE = 3; // points: items this close vertically share a row
const WORD_GAP = 0.3; // x font size: items closer than this are one phrase
const MIN_TABLE_CELLS = 3; // a line with this many separate cells is a table row

// Read every text item from a page with its position and width.
async function readItems(page) {
  const content = await page.getTextContent();
  return content.items
    .filter((it) => it.str && it.str.trim() !== '')
    .map((it) => ({
      text: it.str.trim(),
      x: it.transform[4],
      y: it.transform[5],
      w: it.width || it.str.length * 4,
      size: Math.abs(it.transform[0]) || 8,
    }));
}

// Group items into visual lines, top of the page first.
function groupRows(items) {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows = [];
  for (const it of sorted) {
    const row = rows.find((r) => Math.abs(r.y - it.y) <= ROW_TOLERANCE);
    if (row) row.items.push(it);
    else rows.push({ y: it.y, items: [it] });
  }
  rows.forEach((r) => r.items.sort((a, b) => a.x - b.x));
  return rows;
}

// Merge items that touch on the same line into one cell ("Total" + "Pass" -> "Total Pass").
function mergeTouching(items) {
  const cells = [];
  for (const it of items) {
    const last = cells[cells.length - 1];
    if (last && it.x - (last.x + last.w) < WORD_GAP * it.size) {
      last.text = `${last.text} ${it.text}`;
      last.w = it.x + it.w - last.x;
    } else {
      cells.push({ ...it });
    }
  }
  return cells;
}

// Find column bands for one block of table rows. Cells that sit alone in a
// wide stretch (titles, long labels) are left out so they don't swallow columns.
function findColumns(rows) {
  const cells = rows.flatMap((r) => r.cells);
  const widths = cells.map((c) => c.w).sort((a, b) => a - b);
  const median = widths[Math.floor(widths.length / 2)] || 0;
  const limit = Math.max(median * 4, 60);
  const narrow = cells.filter((c) => c.w <= limit);
  let bands = mergeSpans(narrow);
  // A wide cell (like a subject name) gets its own column when it doesn't
  // straddle two or more of the narrow columns.
  const wide = cells.filter(
    (c) => c.w > limit && bands.filter(([s, e]) => s < c.x + c.w && e > c.x).length <= 1
  );
  if (wide.length) bands = mergeSpans([...narrow, ...wide]);
  return bands;
}

function mergeSpans(cells) {
  const spans = cells.map((c) => [c.x, c.x + c.w]).sort((a, b) => a[0] - b[0]);
  if (!spans.length) return [];
  const bands = [spans[0].slice()];
  for (const [s, e] of spans.slice(1)) {
    const last = bands[bands.length - 1];
    if (s <= last[1] + 1) last[1] = Math.max(last[1], e);
    else bands.push([s, e]);
  }
  return bands;
}

// Split a page's lines into runs of table rows and plain text lines.
function splitBlocks(rows) {
  const blocks = [];
  rows.forEach((r) => {
    const isTable = r.cells.length >= MIN_TABLE_CELLS;
    const last = blocks[blocks.length - 1];
    const prevCount = last && last.rows[last.rows.length - 1].cells.length;
    if (isTable && last && last.table && Math.abs(prevCount - r.cells.length) <= 2) last.rows.push(r);
    else blocks.push({ table: isTable, rows: [r] });
  });
  return blocks;
}

// A cell belongs to the first column band it reaches from its left edge.
function columnIndex(bands, cell) {
  const i = bands.findIndex(([, end]) => cell.x <= end + 1);
  return i === -1 ? bands.length - 1 : i;
}

const asValue = (text) => {
  const t = text.replace(/,/g, '');
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : text;
};

// A header like "Total Student Count" can sit just left of its right-aligned
// numbers and land in a column of its own. When a column holds only that one
// cell and its neighbour is empty on that row, fold the two columns together.
function joinLoneHeaders(lines) {
  const filled = (j) => lines.filter((l) => l[j] !== '').length;
  for (let j = 0; j < (lines[0] || []).length - 1; ) {
    const lone = filled(j) === 1 ? j : filled(j + 1) === 1 ? j + 1 : -1;
    const other = lone === j ? j + 1 : j;
    const row = lone === -1 ? null : lines.find((l) => l[lone] !== '');
    if (row && row[other] === '') {
      lines.forEach((l) => {
        if (l[lone] !== '') l[other] = l[lone];
        l.splice(lone, 1);
      });
    } else {
      j++;
    }
  }
  return lines;
}

const isNumber = (v) => typeof v === 'number';

// Lay out a run of rows as a table and append it to the grid.
function tableLines(rows) {
  const bands = findColumns(rows);
  const lines = rows.map((r) => {
    const line = new Array(bands.length).fill('');
    r.cells.forEach((c) => {
      const i = columnIndex(bands, c);
      line[i] = line[i] ? `${line[i]} ${c.text}` : c.text;
    });
    return line;
  });
  return { bands, lines };
}

function dropEmptyColumns(lines) {
  const width = Math.max(0, ...lines.map((l) => l.length));
  const keep = Array.from({ length: width }, (_, i) => lines.some((l) => l[i] !== '' && l[i] !== undefined));
  return lines.map((l) => l.filter((_, i) => keep[i]));
}

// Plain layout: runs of 3+ cell lines become tables, other lines stay text.
function layoutRows(rows) {
  const grid = [];
  splitBlocks(rows).forEach((block) => {
    if (!block.table) {
      block.rows.forEach((r) => grid.push([r.cells.map((c) => c.text).join('   ')]));
      return;
    }
    const { lines } = tableLines(block.rows);
    grid.push(...joinLoneHeaders(dropEmptyColumns(lines.map((l) => l.map(asValue)))));
  });
  return grid;
}

// Tables whose headers and row labels wrap over several lines (common in
// university ERP exports). The full data rows set the columns; wrapped header
// lines are stacked into one header row, and wrapped labels join their row.
function layoutWrappedTable(rows) {
  const maxCells = Math.max(...rows.map((r) => r.cells.length));
  const need = Math.max(MIN_TABLE_CELLS, Math.ceil(maxCells * 0.6));
  const wideIdx = rows.map((r, i) => (r.cells.length >= need ? i : -1)).filter((i) => i >= 0);
  if (wideIdx.length < 2) return null;
  // Only kick in when short lines sit between the full rows (wrapped text).
  const between = rows.slice(wideIdx[0], wideIdx[wideIdx.length - 1] + 1);
  if (between.every((r) => r.cells.length >= need)) return null;

  const numericShare = (r) => r.cells.filter((c) => isNumber(asValue(c.text))).length / r.cells.length;
  const isData = (r) => r.cells.length >= need && numericShare(r) >= 0.5;
  const dataIdx = rows.map((r, i) => (isData(r) ? i : -1)).filter((i) => i >= 0);
  if (dataIdx.length < 2) return null;

  let a = dataIdx[0];
  while (a > 0 && rows[a - 1].y - rows[a].y <= 13) a--;
  let b = dataIdx[dataIdx.length - 1];
  while (b < rows.length - 1 && rows[b].y - rows[b + 1].y <= 13 && rows[b + 1].cells.length < need) b++;
  const region = rows.slice(a, b + 1);
  const firstData = dataIdx[0] - a;

  const bands = findColumns(region.filter(isData));
  const width = bands.length;
  const header = new Array(width).fill('');
  const body = new Map();
  region.forEach((r, i) => {
    if (!isData(r)) return;
    const line = new Array(width).fill('');
    r.cells.forEach((c) => {
      const col = columnIndex(bands, c);
      line[col] = line[col] ? `${line[col]} ${c.text}` : c.text;
    });
    body.set(i, { line: line.map(asValue), above: new Array(width).fill(''), below: new Array(width).fill('') });
  });
  const dataRows = [...body.keys()];

  region.forEach((r, i) => {
    if (isData(r)) return;
    const nearest = dataRows.reduce((best, d) => (Math.abs(region[d].y - r.y) < Math.abs(region[best].y - r.y) ? d : best), dataRows[0]);
    const target = body.get(nearest);
    r.items.forEach((it) => {
      const col = columnIndex(bands, it);
      const cell = target.line[col];
      const isLabel = cell !== '' && !isNumber(cell);
      const closeToRow = Math.abs(r.y - region[nearest].y) <= 20;
      if (i < firstData && !(isLabel && closeToRow)) {
        header[col] = header[col] ? `${header[col]} ${it.text}` : it.text;
      } else {
        const side = r.y > region[nearest].y ? target.above : target.below;
        side[col] = side[col] ? `${side[col]} ${it.text}` : it.text;
      }
    });
  });

  const lines = dataRows.map((d) => {
    const { line, above, below } = body.get(d);
    return line.map((v, col) => {
      if (!above[col] && !below[col]) return v;
      return [above[col], v === '' ? '' : String(v), below[col]].filter(Boolean).join(' ');
    });
  });
  const table = dropEmptyColumns(header.some(Boolean) ? [header, ...lines] : lines);
  return [...layoutRows(rows.slice(0, a)), ...table, ...layoutRows(rows.slice(b + 1))];
}

// Returns one 2D array per page: [[cell, cell], [cell, cell], ...]
export async function pdfToTables(pdf) {
  const pages = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const rows = groupRows(await readItems(page)).map((r) => ({ ...r, cells: mergeTouching(r.items) }));
    pages.push(layoutWrappedTable(rows) || layoutRows(rows));
  }
  return pages;
}

// Plain text of each page, one string per line.
export async function pdfToLines(pdf) {
  const pages = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const rows = groupRows(await readItems(page));
    pages.push(rows.map((r) => mergeTouching(r.items).map((c) => c.text).join('   ')));
  }
  return pages;
}
