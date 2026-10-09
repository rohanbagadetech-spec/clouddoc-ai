import React, { useState, useRef } from 'react';
import { 
  FileText, UploadCloud, PieChart, MessageSquare, Layers, 
  BookOpen, HelpCircle, User, LogOut, Search, Plus, 
  CheckCircle, ArrowRight, Shield, Zap, Sparkles, AlertCircle,
  TrendingUp, HardDrive, Cpu, RefreshCw, Eye, Download, Trash2,
  ChevronRight, Check, FileCheck, ArrowUpRight, X, CheckCircle2,
  Copy, Clock, Tag, ListOrdered, FileSpreadsheet, Share2
} from 'lucide-react';

export default function App() {
  // SET TO FALSE SO NEW USERS SEE LOGIN / REGISTER SCREEN FIRST
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const fileInputRef = useRef(null);

  // Auth Form State
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  // Dynamic Uploaded Documents List with Detailed Summaries
  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      name: 'Cloud_Architecture_Design_v2.pdf', 
      sizeMB: 2.4, 
      date: '2026-10-05', 
      tag: 'Architecture', 
      status: 'Indexed',
      readTime: '8 min read',
      wordCount: 3420,
      complexity: 'Advanced',
      briefSummary: 'A comprehensive blueprint detailing enterprise cloud deployment, load balancing strategies, auto-scaling groups, and multi-region failover protocols.',
      detailedSummary: `Executive Overview:
This document serves as the architectural reference model for deploying tier-1 enterprise services on hybrid cloud infrastructure. It systematically outlines deployment strategies, high-availability zone clustering, and automated incident recovery.

Key Architectural Pillars:
1. Load Balancing & Traffic Control: Implements Layer 7 Application Load Balancers with automated health checks, dynamic path-based routing, and SSL/TLS offloading.
2. Auto-Scaling Policies: Defines target tracking scaling metrics based on CPU utilization thresholds (>70%) and incoming request rates per target.
3. Resilience & Disaster Recovery: Utilizes active-passive multi-region database replication with sub-5-minute Recovery Time Objective (RTO) and Recovery Point Objective (RPO) near zero.
4. Security Protocols: Enforces zero-trust internal network policies using AWS/Azure VPC peering, private subnets, and strict IAM role delegation.`,
      keyTakeaways: [
        'Multi-region failover achieves 99.99% uptime guarantee.',
        'Layer 7 ALB routing reduces latency by 35% across static asset endpoints.',
        'Enforces IAM zero-trust authentication across microservice gateways.'
      ],
      keywords: ['Cloud Architecture', 'Load Balancer', 'Auto-scaling', 'High Availability', 'Multi-Region', 'Zero Trust'],
      outline: ['1. Architectural Overview', '2. Infrastructure & Scalability', '3. Security & IAM Policies', '4. Disaster Recovery Framework']
    },
    { 
      id: 2, 
      name: 'System_Requirements_Specification.docx', 
      sizeMB: 1.1, 
      date: '2026-10-02', 
      tag: 'Engineering', 
      status: 'Indexed',
      readTime: '5 min read',
      wordCount: 2150,
      complexity: 'Intermediate',
      briefSummary: 'Outlines core software constraints, RAM/CPU requirements, REST API contracts, latency budgets, and compliance regulations.',
      detailedSummary: `System Specification Overview:
This specification defines the strict non-functional and functional mandates for integrating microservices into the core CloudDoc AI ecosystem.

Core Specifications:
1. Operational Hardware Requirements: Minimum 4 CPU cores, 16GB RAM for worker nodes processing concurrent vector embedding indexing.
2. Latency & Performance SLA: Vector database query response time must remain under 120ms at 95th percentile (P95) load.
3. API Contracts: All microservices must expose OpenAPI 3.0 compliant endpoints utilizing JWT-based bearer authentication and rate limiting (100 req/min per tenant).
4. Compliance Mandates: Fully compliant with GDPR data retention limits and SOC2 Type II audit logging requirements.`,
      keyTakeaways: [
        'P95 latency target capped at 120ms for vector embeddings.',
        'Mandatory OpenAPI 3.0 specs with rate limiting at 100 req/min.',
        'Strict SOC2 Type II and GDPR audit compliance required.'
      ],
      keywords: ['SRS Document', 'Memory Limits', 'Security Compliance', 'REST APIs', 'Latency SLA', 'SOC2'],
      outline: ['1. System Scope', '2. Performance Metrics', '3. API Benchmarks', '4. Compliance Checklist']
    },
    { 
      id: 3, 
      name: 'Quarterly_AI_Research_Report.pdf', 
      sizeMB: 5.8, 
      date: '2026-09-28', 
      tag: 'Research', 
      status: 'Indexed',
      readTime: '12 min read',
      wordCount: 5800,
      complexity: 'Advanced',
      briefSummary: 'Analyzes major breakthroughs in Retrieval-Augmented Generation (RAG), vector database semantic indexing, and fine-tuning open LLMs.',
      detailedSummary: `AI & Machine Learning Research Synthesis:
This quarterly research report evaluates state-of-the-art developments in Large Language Models (LLMs), RAG optimization pipelines, and high-dimensional vector search.

Key Research Findings:
1. Retrieval-Augmented Generation (RAG) Advances: Implementing hybrid search (combining BM25 keyword matching with dense vector embeddings) yields a 28% increase in retrieval precision compared to pure vector search.
2. LLM Context Window & Hallucination Mitigation: Contextual compression techniques reduce token consumption by 40% while keeping context relevance score above 92%.
3. Vector Database Benchmarking: PGVector and Pinecone benchmarks show chunking size of 512 tokens with 50-token overlap provides optimal trade-off between query speed and semantic continuity.
4. Model Quantization: 4-bit and 8-bit quantization models achieve 95% of FP16 accuracy while decreasing memory footprint by 60%.`,
      keyTakeaways: [
        'Hybrid search (Dense + BM25) boosts retrieval accuracy by 28%.',
        'Optimal chunking strategy identified: 512 tokens with 50-token overlap.',
        '4-bit quantization reduces GPU VRAM consumption by 60% with negligible loss.'
      ],
      keywords: ['RAG Pipeline', 'LLM Fine-tuning', 'Vector DB', 'Semantic Search', 'Embeddings', 'Quantization'],
      outline: ['1. Executive AI Overview', '2. RAG Benchmarking', '3. Vector Database Metrics', '4. Quantization Analysis']
    }
  ]);

  // Analytics Metrics
  const totalStorageGB = 10.0;
  const storageUsedMB = documents.reduce((acc, curr) => acc + curr.sizeMB, 0);
  const storageUsedGB = (storageUsedMB / 1024).toFixed(2);
  const [questionsCount, setQuestionsCount] = useState(14);

  // Ask Document / Summary Customization State
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || 1);
  const selectedDoc = documents.find(d => d.id === Number(selectedDocId)) || documents[0];
  const [summaryFormat, setSummaryFormat] = useState('detailed'); // 'brief', 'detailed', 'takeaways'
  const [activeDocSubTab, setActiveDocSubTab] = useState('summary'); // 'summary', 'outline', 'keywords'

  const [docQuestions, setDocQuestions] = useState([
    { q: 'What is the primary architectural or research focus of this document?', a: 'The document highlights key deployment standards, memory optimization, latency SLA targets, and vector search strategies.' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Compare Documents State
  const [docA, setDocA] = useState(documents[0]?.id || 1);
  const [docB, setDocB] = useState(documents[1]?.id || 2);
  const [compareResult, setCompareResult] = useState(null);

  // Flashcards & MCQs State
  const [activeStudyTab, setActiveStudyTab] = useState('flashcards');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [botMessages, setBotMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your CloudDoc AI assistant. How can I help you analyze your documents today?' }
  ]);
  const [botInput, setBotInput] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Helper to toggle auth mode cleanly
  const toggleAuthMode = (mode) => {
    setAuthMode(mode);
    setUser({ fullName: '', email: '', password: '' });
  };

  // Static Data for Revision
  const flashcards = [
    { question: 'What is Cloud Document Intelligence?', answer: 'It is the integration of AI models (LLMs, OCR, NLP) with cloud storage to automatically extract, summarize, search, and analyze unstructured documents.' },
    { question: 'How does Document Vectorization work?', answer: 'Text from documents is converted into numerical vector embeddings, allowing semantic search and high-speed similarity querying.' },
    { question: 'What is Retrieval-Augmented Generation (RAG)?', answer: 'RAG is a technique that retrieves relevant context from your private uploaded documents before feeding the prompt to an LLM for factual answers.' }
  ];

  const mcqs = [
    {
      id: 1,
      question: 'Which technology enables rapid context retrieval from uploaded PDFs?',
      options: ['RAG (Retrieval-Augmented Generation)', 'Basic SQL Indexing', 'Linear Regression', 'FTP Protocols'],
      correct: 0
    },
    {
      id: 2,
      question: 'What is the primary benefit of CloudDoc AI Document Comparison tool?',
      options: ['Encrypting PDFs', 'Identifying semantic differences and calculating similarity percentage', 'Formatting text fonts', 'Converting DOCX to MP3'],
      correct: 1
    }
  ];

  // REAL FILE UPLOAD HANDLER
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const fileSizeInMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));
      const fileName = file.name;

      const newDoc = {
        id: Date.now() + Math.random(),
        name: fileName,
        sizeMB: fileSizeInMB > 0 ? fileSizeInMB : 0.6,
        date: new Date().toISOString().split('T')[0],
        tag: fileName.endsWith('.pdf') ? 'PDF File' : 'Document',
        status: 'Indexed',
        readTime: '4 min read',
        wordCount: 1850,
        complexity: 'Intermediate',
        briefSummary: `Executive summary for ${fileName}: Contains critical technical data, structural operational rules, and project specifications.`,
        detailedSummary: `Comprehensive Analysis for "${fileName}":

Overview & Purpose:
This uploaded file (${fileName}) contains structured knowledge regarding technical specifications, workflow procedures, and operational guidelines.

Key Points Extracted:
1. Operational Workflows: Clear task definitions and system configuration standards.
2. Security Protocols: Strict access permissions and encrypted cloud storage compliance.
3. System Integration: Standardized payload formats and vector indexing compatibility.`,
        keyTakeaways: [
          `Custom file "${fileName}" processed successfully into vector store.`,
          'Structured sections indexed for fast AI retrieval.',
          'Ready for interactive Q&A and side-by-side comparison.'
        ],
        keywords: ['Uploaded File', 'Custom Document', 'Vector Indexed', 'AI Processed'],
        outline: ['1. File Header', '2. Executive Summary', '3. Technical Specs', '4. Annexure']
      };
      setDocuments(prev => [newDoc, ...prev]);
    });

    triggerToast(`Successfully uploaded ${files.length} document(s)!`);
  };

  const handleDeleteDoc = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    triggerToast('Document removed from cloud storage.');
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    let content = selectedDoc.detailedSummary;
    if (summaryFormat === 'brief') content = selectedDoc.briefSummary;
    if (summaryFormat === 'takeaways') content = selectedDoc.keyTakeaways.join('\n');

    navigator.clipboard.writeText(content);
    triggerToast('Summary copied to clipboard!');
  };

  // Download Summary as TXT
  const handleDownloadSummary = () => {
    const content = `CloudDoc AI Report - ${selectedDoc.name}\n\n` +
      `Summary Mode: ${summaryFormat.toUpperCase()}\n` +
      `Reading Time: ${selectedDoc.readTime}\n` +
      `Complexity: ${selectedDoc.complexity}\n\n` +
      `${selectedDoc.detailedSummary}`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedDoc.name}_Summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast('Report downloaded successfully!');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    
    // Password length validation check
    if (!user.password || user.password.length < 6) {
      triggerToast('Password must be at least 6 characters long.');
      return;
    }

    if (authMode === 'register' && !user.fullName.trim()) {
      triggerToast('Please provide your full name.');
      return;
    }

    // Default name if registering/logging in
    if (!user.fullName) {
      setUser(prev => ({ ...prev, fullName: prev.email.split('@')[0] }));
    }

    setIsAuthenticated(true);
    triggerToast(`Welcome back, ${user.fullName || 'User'}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ fullName: '', email: '', password: '' });
    setAuthMode('login');
    triggerToast('Successfully logged out.');
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const answer = `Based on context from "${selectedDoc.name}", the document specifies that "${newQuestion.slice(0, 35)}..." complies with Section 4 specifications and operational security policies.`;
    setDocQuestions([...docQuestions, { q: newQuestion, a: answer }]);
    setQuestionsCount(prev => prev + 1);
    setNewQuestion('');
  };

  const handleCompare = () => {
    const itemA = documents.find(d => d.id === Number(docA));
    const itemB = documents.find(d => d.id === Number(docB));
    
    if (docA === docB) {
      triggerToast('Please select two DIFFERENT documents to compare.');
      return;
    }

    setCompareResult({
      similarity: 82,
      commonPoints: [
        `Both ${itemA?.name} and ${itemB?.name} share identical security policies and cloud hosting requirements.`,
        'Shared technical stack using React frontends, Node.js microservices, and Vector Databases.',
        'Matching data privacy compliance standards (SOC2 & GDPR framework).'
      ],
      differences: [
        `${itemA?.name || 'Doc A'} focuses heavily on structural system design and frontend routing.`,
        `${itemB?.name || 'Doc B'} emphasizes backend database connections and memory optimization.`,
        `Resource allocation estimates differ by 18% in execution budget allocations.`
      ]
    });
  };

  const handleBotSend = (e) => {
    e.preventDefault();
    if (!botInput.trim()) return;
    const userMsg = botInput;
    setBotMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setBotInput('');

    setTimeout(() => {
      let botReply = 'I am here to help you navigate CloudDoc AI! You can upload real files, ask questions, compare documents, or test yourself in Study Mode.';
      if (userMsg.toLowerCase().includes('upload')) {
        botReply = 'To upload documents, go to "My Documents" or click "Upload New Document" on the Dashboard, then select any file from your computer!';
      } else if (userMsg.toLowerCase().includes('compare')) {
        botReply = 'Our Document Comparison feature uses semantic NLP to find common points and key differences between any two uploaded files.';
      } else if (userMsg.toLowerCase().includes('summary')) {
        botReply = 'You can toggle between "Brief", "Detailed", and "Key Takeaways" inside the "Ask Document" view!';
      }
      setBotMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  // ----------------------------------------------------
  // AUTH / LOGIN SCREEN (SHOWS FIRST FOR NEW USERS)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-indigo-600 rounded-xl">
              <UploadCloud className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide">CloudDoc <span className="text-indigo-400">AI</span></h1>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-1">
            {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-sm text-slate-400 text-center mb-6">
            {authMode === 'login' ? 'Enter your credentials to access your document workspace' : 'Register to manage and analyze intelligent cloud documents'}
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Rohan Sharma"
                  value={user.fullName}
                  onChange={e => setUser({...user, fullName: e.target.value})}
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="rohan@example.com"
                value={user.email}
                onChange={e => setUser({...user, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="Minimum 6 characters"
                value={user.password}
                onChange={e => setUser({...user, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{authMode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            {authMode === 'login' ? (
              <span>Don't have an account? <button onClick={() => toggleAuthMode('register')} className="text-indigo-400 font-medium hover:underline">Sign Up</button></span>
            ) : (
              <span>Already have an account? <button onClick={() => toggleAuthMode('login')} className="text-indigo-400 font-medium hover:underline">Log In</button></span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN DASHBOARD APPLICATION
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex relative overflow-hidden font-sans">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        multiple 
        className="hidden" 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 z-10 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <UploadCloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">CloudDoc <span className="text-indigo-400">AI</span></h1>
              <span className="text-[10px] text-slate-400">Cloud Intelligence v2.4</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: PieChart },
              { id: 'documents', label: 'My Documents', icon: FileText },
              { id: 'ask', label: 'Ask Document', icon: MessageSquare },
              { id: 'compare', label: 'Compare Documents', icon: Layers },
              { id: 'study', label: 'Study Mode', icon: BookOpen },
              { id: 'profile', label: 'User Profile', icon: User }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-lg">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {(user.fullName || user.email || 'U').substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold truncate">{user.fullName || 'Active User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email || 'user@clouddoc.ai'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
        
        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">System Metrics & Dashboard</h2>
                <p className="text-slate-400 text-sm">Real-time stats for your uploaded documents and cloud memory.</p>
              </div>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Total Documents</p>
                  <h3 className="text-2xl font-bold mt-1">{documents.length}</h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Storage Used</p>
                  <h3 className="text-2xl font-bold mt-1">{storageUsedGB} / {totalStorageGB} GB</h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Memory Used</p>
                  <h3 className="text-2xl font-bold mt-1">512 MB</h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Questions Asked</p>
                  <h3 className="text-2xl font-bold mt-1">{questionsCount}</h3>
                </div>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Cloud Storage Usage</span>
                <span className="text-slate-400">{((storageUsedGB / totalStorageGB) * 100).toFixed(1)}% Used</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (storageUsedGB / totalStorageGB) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => fileInputRef.current.click()} 
                className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-xl text-left transition-all group"
              >
                <UploadCloud className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm">Upload New Document</h4>
                <p className="text-xs text-slate-400 mt-1">Select files from your local drive to index into cloud memory.</p>
              </button>

              <button 
                onClick={() => setActiveTab('ask')} 
                className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-xl text-left transition-all group"
              >
                <Sparkles className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm">AI Analysis & Q&A</h4>
                <p className="text-xs text-slate-400 mt-1">Read multi-page reports, key summaries, and ask document questions.</p>
              </button>

              <button 
                onClick={() => setActiveTab('compare')} 
                className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-xl text-left transition-all group"
              >
                <Layers className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm">Compare 2 Documents</h4>
                <p className="text-xs text-slate-400 mt-1">Check similarity percentage and key differences side-by-side.</p>
              </button>
            </div>
          </div>
        )}

        {/* MY DOCUMENTS VIEW */}
        {activeTab === 'documents' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">My Documents</h2>
                <p className="text-slate-400 text-sm">View, upload, and manage your cloud-indexed files.</p>
              </div>
            </div>

            {/* Interactive Upload Zone */}
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-indigo-500/40 bg-slate-900/50 hover:bg-slate-900 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-indigo-400"
            >
              <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-200">Click anywhere here to select files from your computer</p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT files</p>
              <button 
                type="button" 
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Browse Files
              </button>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase">
                  <tr>
                    <th className="p-4">Document Name</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Read Time</th>
                    <th className="p-4">Tag</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 text-xs">
                        No documents uploaded yet. Click above to upload your first document!
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span className="truncate max-w-xs">{doc.name}</span>
                        </td>
                        <td className="p-4 text-slate-400">{doc.sizeMB} MB</td>
                        <td className="p-4 text-slate-400">{doc.readTime || '5 min'}</td>
                        <td className="p-4">
                          <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2.5 py-1 rounded-full border border-indigo-500/20">
                            {doc.tag || 'General'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ASK DOCUMENT VIEW */}
        {activeTab === 'ask' && selectedDoc && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Ask Document & Summary</h2>
                <p className="text-slate-400 text-sm">Analyze and query details from selected cloud documents.</p>
              </div>

              {/* Document Selector */}
              <select 
                value={selectedDocId} 
                onChange={(e) => setSelectedDocId(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {documents.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary & Analysis Section */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div className="flex gap-2">
                    {['summary', 'outline', 'keywords'].map(sub => (
                      <button 
                        key={sub}
                        onClick={() => setActiveDocSubTab(sub)}
                        className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                          activeDocSubTab === sub 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={handleCopySummary} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                    <button onClick={handleDownloadSummary} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {activeDocSubTab === 'summary' && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {['brief', 'detailed', 'takeaways'].map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => setSummaryFormat(fmt)}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize ${
                            summaryFormat === fmt 
                              ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30' 
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {summaryFormat === 'brief' && selectedDoc.briefSummary}
                      {summaryFormat === 'detailed' && selectedDoc.detailedSummary}
                      {summaryFormat === 'takeaways' && (
                        <ul className="list-disc list-inside space-y-2">
                          {selectedDoc.keyTakeaways.map((point, idx) => (
                            <li key={idx} className="text-slate-300">{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {activeDocSubTab === 'outline' && (
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <h4 className="text-xs uppercase text-slate-400 font-semibold mb-3">Document Section Outline</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {selectedDoc.outline.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-indigo-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeDocSubTab === 'keywords' && (
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <h4 className="text-xs uppercase text-slate-400 font-semibold mb-3">Extracted Semantic Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoc.keywords.map((kw, idx) => (
                        <span key={idx} className="bg-slate-800 border border-slate-700 text-indigo-300 text-xs px-3 py-1 rounded-full">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Q&A Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-base mb-1">Ask Questions</h3>
                  <p className="text-xs text-slate-400 mb-4">Queries search only in context of "{selectedDoc.name}"</p>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {docQuestions.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                        <p className="font-semibold text-indigo-400">Q: {item.q}</p>
                        <p className="text-slate-300">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAskQuestion} className="mt-4 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask anything about this doc..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-semibold">
                    Ask
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* COMPARE DOCUMENTS VIEW */}
        {activeTab === 'compare' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">Compare Documents</h2>
              <p className="text-slate-400 text-sm">Select two files to generate side-by-side semantic comparison and similarity metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Select First Document</label>
                <select 
                  value={docA} 
                  onChange={(e) => setDocA(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Select Second Document</label>
                <select 
                  value={docB} 
                  onChange={(e) => setDocB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 pt-2">
                <button 
                  onClick={handleCompare}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all"
                >
                  Run Semantic Comparison
                </button>
              </div>
            </div>

            {compareResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="font-semibold text-lg">Comparison Results</h3>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">
                    {compareResult.similarity}% Match Score
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs uppercase text-emerald-400 font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Common Standards & Overlaps
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {compareResult.commonPoints.map((pt, idx) => (
                        <li key={idx}>• {pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs uppercase text-amber-400 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Key Structural Differences
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {compareResult.differences.map((diff, idx) => (
                        <li key={idx}>• {diff}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STUDY MODE VIEW */}
        {activeTab === 'study' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">Interactive Study Mode</h2>
              <p className="text-slate-400 text-sm">Review interactive flashcards or practice key multiple-choice questions.</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setActiveStudyTab('flashcards')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                  activeStudyTab === 'flashcards' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Flashcards
              </button>
              <button 
                onClick={() => setActiveStudyTab('mcqs')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                  activeStudyTab === 'mcqs' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                MCQ Practice
              </button>
            </div>

            {activeStudyTab === 'flashcards' && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-6">
                <p className="text-xs text-indigo-400 uppercase font-bold tracking-widest">
                  Card {flashcardIndex + 1} of {flashcards.length}
                </p>

                <div className="min-h-[140px] flex items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800 text-lg font-medium text-slate-200">
                  {showAnswer ? flashcards[flashcardIndex].answer : flashcards[flashcardIndex].question}
                </div>

                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold"
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowAnswer(false);
                      setFlashcardIndex((prev) => (prev + 1) % flashcards.length);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                  >
                    Next Flashcard
                  </button>
                </div>
              </div>
            )}

            {activeStudyTab === 'mcqs' && (
              <div className="space-y-4">
                {mcqs.map((q) => (
                  <div key={q.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
                    <h3 className="text-sm font-semibold text-slate-100">{q.question}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setUserAnswers({ ...userAnswers, [q.id]: idx })}
                          className={`p-3 text-left rounded-lg text-xs font-medium border transition-colors ${
                            userAnswers[q.id] === idx 
                              ? idx === q.correct 
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-red-500/20 border-red-500 text-red-300'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USER PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold">User Profile Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white"
                  value={user.fullName}
                  onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg p-2.5 text-sm text-slate-500 cursor-not-allowed"
                  value={user.email}
                />
              </div>

              <button 
                onClick={() => triggerToast('Profile details updated successfully!')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Assistant Bot */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
          >
            <Sparkles className="w-6 h-6" />
          </button>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-80 h-96 flex flex-col justify-between overflow-hidden">
            <div className="bg-slate-800/80 p-3 flex justify-between items-center border-b border-slate-700">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                CloudDoc Assistant
              </span>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-2 flex-1 text-xs">
              {botMessages.map((msg, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white ml-auto max-w-[80%]' : 'bg-slate-950 text-slate-300 mr-auto max-w-[85%]'}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleBotSend} className="p-2 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask assistant..." 
                className="flex-1 bg-slate-900 text-xs border border-slate-800 rounded-md px-2.5 py-1.5 text-white focus:outline-none"
                value={botInput}
                onChange={(e) => setBotInput(e.target.value)}
              />
              <button type="submit" className="bg-indigo-600 text-white text-xs px-2.5 py-1.5 rounded-md font-semibold">
                Send
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}