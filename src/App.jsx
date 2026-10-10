import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  UploadCloud, FileText, LayoutDashboard, Search, Trash2, LogOut,
  ShieldCheck, Mail, HardDrive, Activity, Plus, Download, Eye, EyeOff,
  Sparkles, FileSearch, User, LockKeyhole, ArrowUpRight
} from 'lucide-react';

const USERS_KEY = 'clouddoc_demo_users_v1';
const SESSION_KEY = 'clouddoc_demo_session_v1';
const DOCS_KEY = 'clouddoc_demo_docs_v1';

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const formatBytes = n =>
  !n ? '0 KB' : n < 1048576
    ? `${(n / 1024).toFixed(1)} KB`
    : `${(n / 1048576).toFixed(2)} MB`;

const formatDate = d =>
  new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

export default function App() {
  const [users, setUsers] = useState(() => read(USERS_KEY, {}));
  const [docsByUser, setDocsByUser] = useState(() => read(DOCS_KEY, {}));
  const [session, setSession] = useState(() => read(SESSION_KEY, null));
  const [mode, setMode] = useState('login');
  const [authStep, setAuthStep] = useState('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(null);
  const [demoOtp, setDemoOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docsByUser));
  }, [docsByUser]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const notify = (message, type = 'ok') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const emailNorm = email.trim().toLowerCase();
  const uid = session?.id || '';

  const docs = useMemo(
    () => uid ? (docsByUser[uid] || []) : [],
    [docsByUser, uid]
  );

  const visibleDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? docs.filter(d => (d.name + ' ' + d.type).toLowerCase().includes(q))
      : docs;
  }, [docs, search]);

  const selected = docs.find(d => d.id === selectedId) || docs[0] || null;

  const updateDocs = fn => {
    if (!uid) return;
    setDocsByUser(prev => ({
      ...prev,
      [uid]: fn(prev[uid] || [])
    }));
  };

  const resetMode = m => {
    setMode(m);
    setAuthStep('form');
    setName('');
    setEmail('');
    setPassword('');
    setPending(null);
    setOtp('');
    setDemoOtp('');
  };

  const submitAuth = e => {
    e.preventDefault();

    if (password.length < 8) {
      notify('Use a password with at least 8 characters.', 'error');
      return;
    }

    if (mode === 'register') {
      if (name.trim().length < 2) {
        notify('Enter your full name.', 'error');
        return;
      }

      if (users[emailNorm]) {
        notify('An account with this email already exists.', 'error');
        return;
      }

      const code = String(
        Math.floor(100000 + Math.random() * 900000)
      );

      setDemoOtp(code);

      setPending({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: name.trim(),
        email: emailNorm,
        password,
        createdAt: new Date().toISOString()
      });

      setAuthStep('otp');
      notify('Demo OTP created. It is not sent by email.', 'error');
      return;
    }

    const account = users[emailNorm];

    if (!account || account.password !== password || !account.verified) {
      notify('Invalid credentials or unverified demo account.', 'error');
      return;
    }

    setSession({
      id: account.id,
      name: account.name,
      email: account.email,
      signedInAt: new Date().toISOString()
    });

    setTab('dashboard');
    notify(`Welcome back, ${account.name}!`);
  };

  const verifyOtp = e => {
    e.preventDefault();

    if (!pending || otp !== demoOtp) {
      notify('Incorrect verification code.', 'error');
      return;
    }

    const account = {
      ...pending,
      verified: true
    };

    setUsers(prev => ({
      ...prev,
      [account.email]: account
    }));

    setDocsByUser(prev => ({
      ...prev,
      [account.id]: []
    }));

    setSession({
      id: account.id,
      name: account.name,
      email: account.email,
      signedInAt: new Date().toISOString()
    });

    setAuthStep('form');
    setPending(null);
    setDemoOtp('');
    setTab('dashboard');
    notify('Demo account created with an empty workspace.');
  };

  const logout = () => {
    setSession(null);
    setTab('dashboard');
    setSelectedId('');
    setAnswer('');
    notify('Signed out.');
  };

  const upload = async e => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';

    for (const file of files) {
      const ext = file.name.toLowerCase().match(/\.(pdf|txt|md|docx)$/)?.[1];

      if (!ext) {
        notify(`${file.name}: use PDF, TXT, MD or DOCX.`, 'error');
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        notify(`${file.name}: maximum size is 10 MB.`, 'error');
        continue;
      }

      let text = '';

      if (ext === 'txt' || ext === 'md') {
        try {
          text = (await file.text()).slice(0, 500000);
        } catch {
          text = '';
        }
      } else {
        text = `${ext.toUpperCase()} selected. Text extraction is not included in this frontend-only demo.`;
      }

      const doc = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        type: ext.toUpperCase(),
        uploadedAt: new Date().toISOString(),
        text
      };

      updateDocs(prev => [doc, ...prev]);
    }

    if (files.length) {
      notify('Upload processed in this browser demo.');
    }
  };

  const removeDoc = doc => {
    if (!window.confirm(`Delete ${doc.name}?`)) return;

    updateDocs(prev => prev.filter(d => d.id !== doc.id));

    if (selectedId === doc.id) {
      setSelectedId('');
    }

    notify('Document deleted.');
  };

  const download = doc => {
    const blob = new Blob([
      `CloudDoc AI report\n${doc.name}\nUploaded: ${formatDate(doc.uploadedAt)}\n\n${doc.text || 'No extracted text.'}`
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${doc.name.replace(/[^\w.-]/g, '_')}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const keywords = doc => {
    const words = (doc?.text || '').toLowerCase().match(/[a-z0-9]{4,}/g) || [];

    const stop = new Set([
      'this', 'that', 'with', 'from', 'have', 'were', 'will',
      'your', 'into', 'there', 'their', 'about', 'which', 'when',
      'what', 'also', 'been', 'they', 'them', 'more', 'most',
      'only', 'document'
    ]);

    const counts = {};

    words.forEach(w => {
      if (!stop.has(w)) {
        counts[w] = (counts[w] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(x => x[0]);
  };

  const ask = e => {
    e.preventDefault();

    if (!selected || !question.trim()) return;

    const terms = question.toLowerCase().split(/\W+/).filter(w => w.length > 2);

    const matches = (selected.text || '')
      .split(/(?<=[.!?])\s+|\n+/)
      .map(s => ({
        s,
        score: terms.reduce(
          (n, t) => n + (s.toLowerCase().includes(t) ? 1 : 0),
          0
        )
      }))
      .filter(x => x.score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    setAnswer(
      matches.length
        ? `Relevant passages from ${selected.name}:\n\n${matches.map(x => '• ' + x.s).join('\n')}`
        : 'No matching passage found. PDF/DOCX extraction and generative AI are not connected in this demo.'
    );
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        {toast && (
          <div className={`fixed right-4 top-4 z-50 rounded-xl border px-4 py-3 text-sm ${
            toast.type === 'error'
              ? 'border-amber-700 bg-amber-950'
              : 'border-emerald-700 bg-emerald-950'
          }`}>
            {toast.message}
          </div>
        )}

        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
              <UploadCloud size={28} />
            </div>
            <h1 className="text-3xl font-bold">
              CloudDoc <span className="text-indigo-400">AI</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Your document workspace
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">
            {authStep === 'otp' ? (
              <>
                <div className="mb-4 flex items-center gap-2">
                  <Mail className="text-indigo-300" />
                  <h2 className="text-xl font-semibold">Verify email</h2>
                </div>

                <p className="text-sm text-slate-400">
                  Demo verification for {pending?.email}
                </p>

                <div className="my-4 rounded-lg border border-amber-700 bg-amber-950/50 p-3 text-sm text-amber-200">
                  Demo only — code: <strong className="tracking-widest">{demoOtp}</strong>.
                  This is not emailed.
                </div>

                <form onSubmit={verifyOtp} className="space-y-3">
                  <input
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-center tracking-[0.4em]"
                    required
                  />

                  <button className="w-full rounded-xl bg-indigo-600 p-3 font-semibold">
                    Verify and create account
                  </button>
                </form>

                <button
                  onClick={() => resetMode('register')}
                  className="mt-4 w-full text-sm text-slate-400"
                >
                  Back
                </button>
              </>
            ) : (
              <>
                <div className="mb-5 flex rounded-xl bg-slate-950 p-1">
                  <button
                    onClick={() => resetMode('login')}
                    className={`flex-1 rounded-lg py-2 text-sm ${
                      mode === 'login' ? 'bg-slate-800' : 'text-slate-400'
                    }`}
                  >
                    Sign in
                  </button>

                  <button
                    onClick={() => resetMode('register')}
                    className={`flex-1 rounded-lg py-2 text-sm ${
                      mode === 'register' ? 'bg-slate-800' : 'text-slate-400'
                    }`}
                  >
                    Create account
                  </button>
                </div>

                <h2 className="text-xl font-semibold">
                  {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
                </h2>

                <p className="mb-5 mt-1 text-sm text-slate-400">
                  New accounts start with zero documents.
                </p>

                <form onSubmit={submitAuth} className="space-y-4">
                  {mode === 'register' && (
                    <label className="block text-sm text-slate-300">
                      Full name
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                        required
                      />
                    </label>
                  )}

                  <label className="block text-sm text-slate-300">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                      required
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Password
                    <div className="relative mt-1.5">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        minLength={8}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 pr-12"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-3 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>

                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 p-3 font-semibold hover:bg-indigo-500">
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                    <ArrowUpRight size={18} />
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            CloudDoc AI · Cloud Computing Project
          </p>
        </div>
      </div>
    );
  }

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'My Documents', icon: FileText },
    { id: 'assistant', label: 'Document Assistant', icon: Sparkles },
    { id: 'compare', label: 'Compare Files', icon: FileSearch },
    { id: 'profile', label: 'Security & Profile', icon: ShieldCheck }
  ];

  const storage = docs.reduce((n, d) => n + d.size, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      {toast && (
        <div className={`fixed right-4 top-4 z-50 rounded-xl border px-4 py-3 text-sm shadow-xl ${
          toast.type === 'error'
            ? 'border-amber-700 bg-amber-950'
            : 'border-emerald-700 bg-emerald-950'
        }`}>
          {toast.message}
        </div>
      )}

      <aside className="flex w-full flex-col border-b border-slate-800 bg-slate-900 p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="rounded-xl bg-indigo-600 p-2.5">
            <UploadCloud size={22} />
          </div>
          <div>
            <h1 className="font-bold">
              CloudDoc <span className="text-indigo-400">AI</span>
            </h1>
            <p className="text-[11px] text-slate-500">Workspace demo</p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-1 md:block md:space-y-1">
          {nav.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${
                  tab === item.id
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <Activity size={15} /> Workspace active
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Browser storage, not cloud storage
          </p>
        </div>

        <div className="mt-auto hidden border-t border-slate-800 pt-4 md:block">
          <p className="truncate text-sm font-medium">{session.name}</p>
          <p className="mb-3 truncate text-xs text-slate-500">{session.email}</p>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-300"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[.2em] text-indigo-400">
              Cloud workspace
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              {nav.find(n => n.id === tab)?.label}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Hello {session.name.split(' ')[0]}, manage your documents.
            </p>
          </div>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold hover:bg-indigo-500"
          >
            <Plus size={17} /> Upload document
          </button>

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.md,.docx"
            multiple
            onChange={upload}
            className="hidden"
          />
        </header>

        {tab === 'dashboard' && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Total documents', value: docs.length, icon: FileText },
                { label: 'Storage used', value: formatBytes(storage), icon: HardDrive },
                { label: 'PDF files', value: docs.filter(d => d.type === 'PDF').length, icon: FileSearch },
                { label: 'Demo verification', value: 'Enabled', icon: ShieldCheck }
              ].map(s => {
                const Icon = s.icon;

                return (
                  <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-4 flex justify-between text-sm text-slate-400">
                      {s.label} <Icon size={19} className="text-indigo-300" />
                    </div>
                    <p className="text-3xl font-bold">{s.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Storage usage</h3>
                <span className="text-sm text-slate-400">
                  {(storage / 52428800 * 100).toFixed(1)}% of 50 MB demo limit
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                  style={{ width: `${Math.min(100, storage / 52428800 * 100)}%` }}
                />
              </div>
            </div>

            <section className="rounded-2xl border border-slate-800 bg-slate-900">
              <div className="border-b border-slate-800 p-5">
                <h3 className="font-semibold">Recent documents</h3>
              </div>

              {docs.length ? (
                docs.slice(0, 5).map(d => (
                  <div key={d.id} className="flex items-center gap-3 border-b border-slate-800 p-4">
                    <FileText className="text-indigo-300" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatBytes(d.size)} · {formatDate(d.uploadedAt)}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedId(d.id);
                        setTab('assistant');
                      }}
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <Eye size={17} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <FileText className="mx-auto mb-3 text-slate-600" size={30} />
                  <h3 className="font-semibold">No documents yet</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Your new workspace is empty. Upload your first file.
                  </p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold"
                  >
                    Upload first document
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {tab === 'documents' && (
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
              <div>
                <h3 className="font-semibold">My documents</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {docs.length} files in this browser
                </p>
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search files…"
                  className="rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {visibleDocs.length ? (
              visibleDocs.map(d => (
                <div key={d.id} className="flex flex-wrap items-center gap-3 border-b border-slate-800 p-4">
                  <FileText className="text-indigo-300" />

                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium">{d.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatBytes(d.size)} · {d.type} · {formatDate(d.uploadedAt)}
                    </p>
                  </div>

                  <button
                    title="Download text report"
                    onClick={() => download(d)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Download size={17} />
                  </button>

                  <button
                    title="Analyze"
                    onClick={() => {
                      setSelectedId(d.id);
                      setTab('assistant');
                    }}
                    className="p-2 text-indigo-300"
                  >
                    <Sparkles size={17} />
                  </button>

                  <button
                    title="Delete"
                    onClick={() => removeDoc(d)}
                    className="p-2 text-slate-400 hover:text-red-300"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-sm text-slate-500">
                {docs.length ? 'No matching files.' : 'No documents uploaded yet.'}
              </div>
            )}
          </section>
        )}

        {tab === 'assistant' && (
          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <FileSearch className="text-indigo-300" /> Select document
              </h3>

              {docs.length ? docs.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedId(d.id);
                    setAnswer('');
                  }}
                  className={`mb-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                    selected?.id === d.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  <FileText size={18} />
                  <span className="truncate text-sm">{d.name}</span>
                </button>
              )) : (
                <p className="text-sm text-slate-500">Upload a document first.</p>
              )}

              {selected && (
                <div className="mt-5 rounded-xl bg-slate-950 p-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
                    Keyword extraction
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {keywords(selected).length ? (
                      keywords(selected).map(k => (
                        <span key={k} className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-200">
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        No text keywords available.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <Sparkles className="text-indigo-300" /> Ask your document
              </h3>

              <p className="mb-5 text-sm text-slate-500">
                Find matching passages in text-based files.
              </p>

              <form onSubmit={ask} className="flex gap-2">
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="What does the document say about…"
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                  disabled={!selected}
                />

                <button
                  disabled={!selected || !question.trim()}
                  className="rounded-xl bg-indigo-600 px-4 text-sm font-semibold disabled:opacity-40"
                >
                  Search
                </button>
              </form>

              <div className="mt-5 min-h-48 whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-slate-300">
                {answer || 'Matching passages will appear here. This demo uses keyword matching, not a generative AI model.'}
              </div>

              {selected && (
                <button
                  onClick={() => download(selected)}
                  className="mt-4 flex items-center gap-2 text-sm text-indigo-300"
                >
                  <Download size={16} /> Export text
                </button>
              )}
            </section>
          </div>
        )}

        {tab === 'compare' && (
          <section className="max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <FileSearch className="text-indigo-300" /> Compare documents
            </h3>

            <p className="mb-5 text-sm text-slate-500">
              Compare keyword overlap in extracted text. This is lexical comparison, not semantic AI similarity.
            </p>

            {docs.length < 2 ? (
              <p className="rounded-xl bg-slate-950 p-5 text-sm text-slate-500">
                Upload at least two documents to compare them.
              </p>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-slate-400">
                    First document
                    <select
                      value={compareA || docs[0]?.id || ''}
                      onChange={e => setCompareA(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100"
                    >
                      {docs.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm text-slate-400">
                    Second document
                    <select
                      value={compareB || docs[1]?.id || ''}
                      onChange={e => setCompareB(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100"
                    >
                      {docs.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {(() => {
                  const a = docs.find(d => d.id === (compareA || docs[0]?.id));
                  const b = docs.find(d => d.id === (compareB || docs[1]?.id));

                  if (!a || !b) return null;

                  if (a.id === b.id) {
                    return (
                      <p className="mt-4 text-sm text-amber-300">
                        Select two different documents.
                      </p>
                    );
                  }

                  const wa = new Set(keywords(a));
                  const wb = new Set(keywords(b));
                  const common = [...wa].filter(w => wb.has(w));
                  const all = new Set([...wa, ...wb]);
                  const pct = all.size
                    ? Math.round(common.length / all.size * 100)
                    : 0;

                  return (
                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Keyword overlap</p>
                          <p className="mt-1 text-3xl font-bold text-indigo-300">
                            {pct}%
                          </p>
                        </div>
                        <p className="text-xs text-slate-500">
                          {common.length} shared top keywords
                        </p>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
                        Common keywords
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {common.length ? common.map(w => (
                          <span key={w} className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-200">
                            {w}
                          </span>
                        )) : (
                          <span className="text-sm text-slate-500">
                            No shared keywords found in available text.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </section>
        )}

        {tab === 'profile' && (
          <div className="max-w-3xl space-y-5">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex items-center gap-3">
                <User className="text-indigo-300" />
                <div>
                  <h3 className="font-semibold">Profile</h3>
                  <p className="text-sm text-slate-500">Browser demo account</p>
                </div>
              </div>

              <p className="mb-2 text-xs text-slate-500">Name</p>
              <p className="mb-4 text-sm">{session.name}</p>

              <p className="mb-2 text-xs text-slate-500">Email</p>
              <p className="break-all text-sm">{session.email}</p>
            </section>

            <section className="rounded-2xl border border-amber-700/40 bg-amber-950/20 p-6">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-300">
                <ShieldCheck size={20} /> Security limitations
              </h3>

              <p className="text-sm leading-relaxed text-slate-300">
                This quick version stores account records and documents in localStorage.
                The OTP is displayed in the UI rather than emailed, and passwords are not
                securely hashed. This is not production authentication, remote cloud storage,
                or protection against a technically capable user. Do not store sensitive files.
              </p>
            </section>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-300"
            >
              <LogOut size={17} /> Sign out
            </button>
          </div>
        )}

        <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-slate-800 pt-5 text-xs text-slate-600">
          <span>CloudDoc AI · Cloud Computing Project</span>
          <span className="flex items-center gap-1">
            <LockKeyhole size={13} /> Frontend-only demo build
          </span>
        </footer>
      </main>
    </div>
  );
}