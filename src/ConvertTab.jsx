import React, { useRef, useState } from 'react';
import { UploadCloud, RefreshCw, Download, FileText, X, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ACCEPT, FORMATS, TARGETS, convert, kindOf } from './converters';

const KIND_LABEL = { pdf: 'PDF', docx: 'Word', pptx: 'PowerPoint', xlsx: 'Excel / CSV', image: 'Image', txt: 'Text' };

const POPULAR = [
  ['PDF', 'Excel'], ['PDF', 'Word'], ['Word', 'PDF'], ['Word', 'PowerPoint'],
  ['PowerPoint', 'Word'], ['PowerPoint', 'PDF'], ['Excel', 'PDF'], ['Image', 'PDF'],
];

export default function ConvertTab({ onToast }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);

  const kind = files[0] ? kindOf(files[0]) : null;
  const targets = kind ? TARGETS[kind] : [];

  const pickFiles = (list) => {
    const chosen = Array.from(list || []);
    if (!chosen.length) return;
    const k = kindOf(chosen[0]);
    setError('');
    setResult(null);
    if (!k) {
      setFiles([]);
      setError('That file type isn\'t supported. Try PDF, Word, PowerPoint, Excel, CSV, text, or an image.');
      return;
    }
    // Several files only make sense for images -> one PDF.
    const kept = k === 'image' ? chosen.filter((f) => kindOf(f) === 'image') : [chosen[0]];
    setFiles(kept);
    setTarget(TARGETS[k][0]);
  };

  const run = async () => {
    if (!files.length || !target) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const out = await convert(files, target);
      const url = URL.createObjectURL(out.blob);
      setResult({ ...out, url });
      onToast && onToast(`Converted to ${FORMATS[target].label}!`);
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(
        err?.name === 'PasswordException'
          ? 'This PDF is password-protected. Remove the password and try again.'
          : `Couldn't convert this file: ${err?.message || 'unknown error'}`
      );
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFiles([]);
    setTarget('');
    setResult(null);
    setError('');
  };

  // First table found in the converted content, for a quick preview.
  const previewTable = result?.doc?.sections.flatMap((s) => s.blocks).find((b) => b.type === 'table');
  const scannedPdf = kind === 'pdf' && result?.doc && result.doc.sections.every((s) => s.blocks.length === 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">File Converter</h2>
        <p className="text-slate-400 text-sm">
          Convert PDF, Word, PowerPoint, Excel and images. Files are converted right in your browser and never uploaded.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {POPULAR.map(([from, to]) => (
          <span key={from + to} className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1">
            {from} <ArrowRight className="w-3 h-3 text-indigo-400" /> {to}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => { pickFiles(e.target.files); e.target.value = ''; }}
      />

      {!files.length ? (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pickFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragging ? 'border-indigo-400 bg-slate-900' : 'border-indigo-500/40 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-400'
          }`}
        >
          <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-200">Drop a file here or click to choose one</p>
          <p className="text-xs text-slate-500 mt-1">PDF, DOCX, PPTX, XLSX, CSV, TXT, or images (pick several images to make one PDF)</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-indigo-600/20 rounded-lg shrink-0">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {files.length > 1 ? `${files.length} images` : files[0].name}
                </p>
                <p className="text-xs text-slate-400">
                  {KIND_LABEL[kind]} · {(files.reduce((n, f) => n + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button onClick={reset} className="text-slate-400 hover:text-white p-1 rounded" title="Choose another file">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-2">Convert to</p>
            <div className="flex flex-wrap gap-2">
              {targets.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTarget(t); setResult(null); }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    target === t
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-indigo-500/50'
                  }`}
                >
                  {FORMATS[t].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={run}
              disabled={busy}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} />
              {busy ? 'Converting...' : `Convert to ${FORMATS[target]?.label || ''}`}
            </button>
            {result && (
              <a
                href={result.url}
                download={result.filename}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" /> Download {result.filename}
              </a>
            )}
          </div>

          {result && !scannedPdf && (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Done. Your file is ready to download.
            </p>
          )}
          {scannedPdf && (
            <p className="text-xs text-yellow-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> No text found. This looks like a scanned PDF, which needs OCR to convert.
            </p>
          )}
          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
        </div>
      )}

      {previewTable && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 text-xs text-slate-400">
            Preview of the first table found ({previewTable.rows.length} rows)
          </div>
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs text-slate-300">
              <tbody className="divide-y divide-slate-800">
                {previewTable.rows.slice(0, 10).map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-slate-800/60 font-semibold text-slate-200' : ''}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 whitespace-nowrap">{String(cell ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500">
        Conversions keep text and tables. Layout, fonts and pictures inside documents may not carry over exactly.
      </p>
    </div>
  );
}
