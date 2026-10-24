import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  FileText, UploadCloud, PieChart, MessageSquare, Layers, 
  BookOpen, HelpCircle, User, LogOut, Plus, 
  CheckCircle, ArrowRight, Shield, Zap, Sparkles, AlertCircle,
  TrendingUp, HardDrive, Cpu, RefreshCw, Eye, Download, Trash2,
  ChevronRight, Check, FileCheck, ArrowUpRight, X, CheckCircle2,
  Copy, Clock, Tag, ListOrdered, FileSpreadsheet, Share2, SearchCode,
  Network, Sliders, GraduationCap, Briefcase, Award, Bot, Send
} from 'lucide-react';
import ConvertTab from './ConvertTab';
import { chat, excerpt } from './ai';
import { extractText } from './converters';


export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('clouddoc_auth') === 'true';
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const fileInputRef = useRef(null);

  // Auth Form State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clouddoc_current_user');
    return saved ? JSON.parse(saved) : { fullName: '', email: '', password: '' };
  });

  // Default Demo Documents (Shown ONLY for default demo login, NEVER for newly registered accounts)
  const defaultDemoDocs = [
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
      outline: ['1. Architectural Overview', '2. Infrastructure & Scalability', '3. Security & IAM Policies', '4. Disaster Recovery Framework'],
      adaptiveReading: {
        beginner: "Imagine a giant digital library that automatically hires extra workers whenever too many visitors arrive. If one building breaks down, a backup building instantly opens across town without losing any books.",
        college: "This report details hybrid cloud system design. It highlights Layer 7 load balancing to route web traffic efficiently and configures auto-scaling policies triggered when server CPU usage exceeds 70%.",
        professional: "Enterprise operational blueprint focusing on multi-region high availability, sub-5-minute RTO/RPO disaster recovery, and zero-trust IAM role delegation to minimize operational risks.",
        expert: "Architectural specification utilizing active-passive replication across AWS/Azure VPC peering. Enforces strict zero-trust subnets, JWT bearer tokens, and automated P95 latency containment under 120ms."
      },
      graphNodes: ['AWS VPC Gateway', 'Layer 7 ALB', 'Auto-Scaling Group (>70%)', 'Multi-Region DB', 'Zero Trust IAM'],
      knowledgeGaps: {
        missingInfo: [
          'Does not compare financial cost models or estimated monthly cloud expenditure across AWS, Azure, or GCP.',
          'Lacks explicit details on encryption key rotation cycles and KMS policies.'
        ],
        unansweredQuestions: [
          'What happens to active user sessions during an automated database failover transition?',
          'What are the compliance penalties if cross-region data replication violates regional data residency laws?'
        ],
        improvements: [
          'Include a side-by-side cost estimation table for bandwidth and storage scaling.',
          'Add a threat modeling matrix covering external DDoS mitigation and firewall rules.'
        ]
      },
      studyMode: {
        flashcards: [
          { question: 'What is the primary failover objective in Cloud_Architecture_Design_v2.pdf?', answer: 'Sub-5-minute RTO/RPO near zero with active-passive multi-region replication.' },
          { question: 'What CPU threshold triggers auto-scaling?', answer: 'Auto-scaling policy triggers when server CPU utilization exceeds 70%.' }
        ],
        mcqs: [
          {
            id: 1,
            question: 'Which load balancer component is specified for routing?',
            options: ['Layer 7 Application Load Balancer', 'DNS Round Robin', 'Static Reverse Proxy', 'Direct Network Switch'],
            correct: 0
          }
        ]
      }
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
      outline: ['1. System Scope', '2. Performance Metrics', '3. API Benchmarks', '4. Compliance Checklist'],
      adaptiveReading: {
        beginner: "This document is a rulebook for building software. It explains how fast the computer must answer questions and how much memory it needs to run smoothly.",
        college: "An engineering specification outlining system constraints, including 120ms latency limits for vector queries and mandatory OpenAPI 3.0 REST interfaces.",
        professional: "Technical mandate establishing 99.9% uptime SLAs, SOC2 Type II audit logging, and rate limiting at 100 requests per minute per tenant.",
        expert: "System requirement specification enforcing strict 16GB RAM worker node thresholds and 120ms P95 query SLAs across vector embedding databases."
      },
      graphNodes: ['OpenAPI 3.0 REST', '120ms P95 Latency', '16GB RAM Nodes', 'SOC2 Type II Audit', 'JWT Auth'],
      knowledgeGaps: {
        missingInfo: [
          'Does not specify fallbacks if the primary API rate limiting gateway goes offline.',
          'Lacks detailed database migration scripts for updating microservice schemas.'
        ],
        unansweredQuestions: [
          'How are bulk document batch uploads throttled during peak hours?',
          'What is the maximum allowed file payload size per single REST API request?'
        ],
        improvements: [
          'Define circuit breaker patterns for graceful API service degradation.',
          'Provide benchmark graphs showing RAM consumption under 10,000 concurrent vector queries.'
        ]
      },
      studyMode: {
        flashcards: [
          { question: 'What is the P95 query latency cap specified?', answer: '120ms for vector embedding queries.' },
          { question: 'What minimum node memory is required?', answer: 'Minimum 16GB RAM for worker nodes.' }
        ],
        mcqs: [
          {
            id: 1,
            question: 'What is the per-tenant API rate limit restriction?',
            options: ['100 requests per minute', '500 requests per minute', 'Unlimited', '10 requests per second'],
            correct: 0
          }
        ]
      }
    }
  ];

  // User Documents State (Per-User Storage)
  const [documents, setDocuments] = useState(() => {
    if (!user || !user.email) return [];
    const userStorageKey = `clouddoc_docs_${user.email.toLowerCase()}`;
    const savedDocs = localStorage.getItem(userStorageKey);
    return savedDocs !== null ? JSON.parse(savedDocs) : defaultDemoDocs;
  });

  // Track Asked Questions per User
  const [questionsCount, setQuestionsCount] = useState(() => {
    if (!user || !user.email) return 0;
    const savedCount = localStorage.getItem(`clouddoc_qcount_${user.email.toLowerCase()}`);
    return savedCount !== null ? JSON.parse(savedCount) : 0;
  });

  // Sync Documents to LocalStorage
  useEffect(() => {
    if (user && user.email) {
      const userStorageKey = `clouddoc_docs_${user.email.toLowerCase()}`;
      localStorage.setItem(userStorageKey, JSON.stringify(documents));
    }
  }, [documents, user]);

  // Sync Question Count to LocalStorage
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`clouddoc_qcount_${user.email.toLowerCase()}`, JSON.stringify(questionsCount));
    }
  }, [questionsCount, user]);

  // Analytics Metrics
  const totalStorageGB = 10.0;
  const storageUsedMB = documents.reduce((acc, curr) => acc + (curr.sizeMB || 0), 0);
  const storageUsedGB = (storageUsedMB / 1024).toFixed(2);
  const memoryUsedMB = documents.length === 0 ? 0 : Math.round(documents.length * 128);

  // Active Selected Document State
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || null);
  const selectedDoc = documents.find(d => d.id === Number(selectedDocId)) || documents[0] || {};
  const [summaryFormat, setSummaryFormat] = useState('detailed'); // 'brief', 'detailed', 'takeaways'
  const [readingLevel, setReadingLevel] = useState('college'); // 'beginner', 'college', 'professional', 'expert'

  // Q&A State
  const [docQuestions, setDocQuestions] = useState([
    { q: 'What is the primary architectural focus of this document?', a: 'The document highlights deployment standards, auto-scaling thresholds, memory limits, and vector database query SLA targets.' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Compare Documents State
  const [docA, setDocA] = useState(documents[0]?.id || '');
  const [docB, setDocB] = useState(documents[1]?.id || '');
  const [compareResult, setCompareResult] = useState(null);
  const hasDoc = (id) => documents.some(d => d.id === Number(id));
  const effA = hasDoc(docA) ? Number(docA) : documents[0]?.id;
  const effB = hasDoc(docB) && Number(docB) !== effA ? Number(docB) : documents.find(d => d.id !== effA)?.id;

  // Flashcards & MCQs State
  const [activeStudyTab, setActiveStudyTab] = useState('flashcards');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [botMessages, setBotMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your CloudDoc AI assistant powered by GPT OSS 120B. How can I help you analyze your documents today?' }
  ]);
  const [botInput, setBotInput] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Real-time Password Strength Meter Calculator
  const passwordStrength = useMemo(() => {
    if (!user.password) return { text: '', color: 'bg-slate-700', score: 0 };
    let score = 0;
    if (user.password.length >= 8) score++;
    if (/[A-Z]/.test(user.password)) score++;
    if (/[0-9]/.test(user.password)) score++;
    if (/[^A-Za-z0-9]/.test(user.password)) score++;

    if (score <= 1) return { text: 'Weak password', color: 'bg-red-500', score: 1 };
    if (score === 2 || score === 3) return { text: 'Medium strength', color: 'bg-yellow-500', score: 2 };
    return { text: 'Strong password', color: 'bg-emerald-500', score: 3 };
  }, [user.password]);

  // REAL FILE UPLOAD HANDLER POWERED BY GROQ (GPT OSS 120B)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    triggerToast('Reading and analyzing your document...');
    let aiAnalysisFailed = false;

    for (const file of files) {
      const fileSizeInMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));
      const fileName = file.name;

      let content = '';
      try {
        content = await extractText(file);
      } catch (err) {
        console.error('Text extraction failed:', err);
      }
      const words = content ? content.split(/\s+/).filter(Boolean).length : 0;
      const avgWordLen = words ? content.replace(/\s+/g, '').length / words : 0;

      let aiAnalysis = null;
      try {
        aiAnalysis = await chat([
            {
              role: 'system',
              content: `You are an expert AI document auditor. Analyze the document text provided by the user (fall back to the title only if no text is given). Every summary, takeaway, flashcard and MCQ must come from the actual content, with real names, numbers and facts from it. Generate 5 flashcards and 5 MCQs, and vary which option index is correct. Return ONLY a valid JSON object formatted strictly as:
{
  "briefSummary": "Concise 2-sentence summary tailored to this specific file topic.",
  "detailedSummary": "Structured overview covering the document core goals, specs, and components.",
  "keyTakeaways": ["Key takeaway 1 specific to this file", "Key takeaway 2", "Key takeaway 3"],
  "adaptiveReading": {
    "beginner": "Simple explanation using everyday analogies specific to this document.",
    "college": "Academic explanation detailing underlying concepts and terms.",
    "professional": "Business, SLA, operational risk, and implementation perspective.",
    "expert": "In-depth technical breakdown, specifications, and architecture."
  },
  "graphNodes": ["Main Concept", "Node 1", "Node 2", "Node 3"],
  "knowledgeGaps": {
    "missingInfo": ["Specific missing item 1 for this document topic", "Specific missing item 2"],
    "unansweredQuestions": ["Specific unresolved question 1", "Specific unresolved question 2"],
    "improvements": ["Actionable recommendation 1", "Actionable recommendation 2"]
  },
  "studyMode": {
    "flashcards": [
      {"question": "What is the core focus of ${fileName}?", "answer": "Detailed answer explaining the main purpose of ${fileName}."},
      {"question": "What primary requirement is specified in ${fileName}?", "answer": "Explanation of system specs and operational rules."}
    ],
    "mcqs": [
      {
        "id": 1,
        "question": "Which main feature or component is highlighted in ${fileName}?",
        "options": ["Primary Feature / Module", "Database Schema", "Unrelated Framework", "Legacy Protocol"],
        "correct": 0
      },
      {
        "id": 2,
        "question": "What key metric or goal is emphasized in the document?",
        "options": ["High performance / Quality target", "Low bandwidth quota", "Manual review process", "Static caching"],
        "correct": 0
      }
    ]
  }
}`
            },
            {
              role: 'user',
              content: `Document title: ${fileName}\n\nDocument text:\n${excerpt(content) || '(no extractable text)'}`
            }
          ], { json: true });
      } catch (err) {
        console.error("Groq GPT OSS 120B Error:", err);
        aiAnalysisFailed = true;
      }

      const newDoc = {
        id: Date.now() + Math.random(),
        name: fileName,
        sizeMB: fileSizeInMB > 0 ? fileSizeInMB : 0.6,
        date: new Date().toISOString().split('T')[0],
        tag: /\.pdf$/i.test(fileName) ? 'PDF File' : /\.pptx$/i.test(fileName) ? 'Presentation' : /\.(xlsx|xls|csv)$/i.test(fileName) ? 'Spreadsheet' : 'Document',
        status: 'Indexed',
        readTime: `${Math.max(1, Math.round(words / 200))} min read`,
        wordCount: words,
        complexity: avgWordLen > 6 ? 'Advanced' : avgWordLen > 5 ? 'Intermediate' : 'Beginner',
        content: content.slice(0, 30000),
        briefSummary: aiAnalysis?.briefSummary || `Executive summary for ${fileName}: Outlines core specifications and project scope.`,
        detailedSummary: aiAnalysis?.detailedSummary || `Detailed analysis for ${fileName}: Covers system requirements, workflows, and operational rules.`,
        keyTakeaways: aiAnalysis?.keyTakeaways || [`Custom file "${fileName}" processed successfully into vector store.`, 'Structured sections indexed for fast AI retrieval.'],
        adaptiveReading: aiAnalysis?.adaptiveReading || {
          beginner: `This document (${fileName}) explains key project guidelines using simple step-by-step concepts.`,
          college: `An academic summary of ${fileName} detailing structural workflows and requirements.`,
          professional: `Enterprise evaluation of ${fileName} focusing on operational scalability and SLA constraints.`,
          expert: `Low-level technical breakdown of ${fileName} emphasizing system architecture.`
        },
        graphNodes: aiAnalysis?.graphNodes || [fileName, 'System Architecture', 'Core Features', 'Tech Stack'],
        knowledgeGaps: aiAnalysis?.knowledgeGaps || {
          missingInfo: [`The document explains workflows in "${fileName}" but omits cloud cost estimates.`],
          unansweredQuestions: [`What are the concrete scalability limits when requests exceed thresholds?`],
          improvements: ['Add a financial analysis section addressing cost vs performance trade-offs.']
        },
        studyMode: aiAnalysis?.studyMode || {
          flashcards: [
            { question: `What is the core focus of ${fileName}?`, answer: `Outlines system specifications and core architecture for ${fileName}.` },
            { question: `What requirements are specified in ${fileName}?`, answer: `Standard high-availability configurations and vector processing pipelines.` }
          ],
          mcqs: [
            {
              id: 1,
              question: `Which architectural component is primary in ${fileName}?`,
              options: ['Core System Architecture', 'Static File Indexing', 'Linear Scripting', 'Legacy Protocols'],
              correct: 0
            }
          ]
        }
      };

      setDocuments(prev => [newDoc, ...prev]);
      setSelectedDocId(newDoc.id);
    }

    triggerToast(aiAnalysisFailed ? 'Saved, but AI analysis failed. Check the server key.' : 'GPT OSS 120B Analysis Complete!');
  };

  const handleDeleteDoc = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    triggerToast('Document removed from cloud storage.');
  };

  const handleCopySummary = () => {
    if (!selectedDoc.name) return;
    let content = selectedDoc.detailedSummary;
    if (summaryFormat === 'brief') content = selectedDoc.briefSummary;
    if (summaryFormat === 'takeaways') content = selectedDoc.keyTakeaways?.join('\n') || '';

    navigator.clipboard.writeText(content);
    triggerToast('Summary copied to clipboard!');
  };

  const handleDownloadSummary = () => {
    if (!selectedDoc.name) return;
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
    
    if (!user.password || user.password.length < 6) {
      triggerToast('Password must be at least 6 characters long.');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('clouddoc_registered_users') || '[]');

    if (authMode === 'register') {
      if (!user.fullName.trim()) {
        triggerToast('Please provide your full name.');
        return;
      }

      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (existingUser) {
        triggerToast('Account already exists! Please log in.');
        return;
      }

      const newUser = {
        fullName: user.fullName,
        email: user.email.toLowerCase(),
        password: user.password
      };

      registeredUsers.push(newUser);
      localStorage.setItem('clouddoc_registered_users', JSON.stringify(registeredUsers));

      // NEW USER STARTS WITH ABSOLUTE ZERO METRICS & ZERO DOCUMENTS
      const userKey = `clouddoc_docs_${newUser.email}`;
      localStorage.setItem(userKey, JSON.stringify([]));
      localStorage.setItem(`clouddoc_qcount_${newUser.email}`, JSON.stringify(0));
      
      setDocuments([]);
      setQuestionsCount(0);

      localStorage.setItem('clouddoc_auth', 'true');
      localStorage.setItem('clouddoc_current_user', JSON.stringify(newUser));
      setIsAuthenticated(true);
      triggerToast(`Account created! Welcome ${newUser.fullName}.`);
    } else {
      // LOGIN MODE
      const existingUser = registeredUsers.find(
        u => u.email.toLowerCase() === user.email.toLowerCase() && u.password === user.password
      );

      const loggedUser = existingUser || {
        fullName: user.fullName || user.email.split('@')[0] || 'Rohan Sharma',
        email: user.email || 'rohan@example.com',
        password: user.password
      };

      const userKey = `clouddoc_docs_${loggedUser.email.toLowerCase()}`;
      const savedUserDocs = localStorage.getItem(userKey);
      setDocuments(savedUserDocs !== null ? JSON.parse(savedUserDocs) : defaultDemoDocs);

      const savedCount = localStorage.getItem(`clouddoc_qcount_${loggedUser.email.toLowerCase()}`);
      setQuestionsCount(savedCount !== null ? JSON.parse(savedCount) : (savedUserDocs !== null ? 0 : 14));

      localStorage.setItem('clouddoc_auth', 'true');
      localStorage.setItem('clouddoc_current_user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      setIsAuthenticated(true);
      triggerToast(`Welcome back, ${loggedUser.fullName}!`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clouddoc_auth');
    localStorage.removeItem('clouddoc_current_user');
    setIsAuthenticated(false);
    setUser({ fullName: '', email: '', password: '' });
    setAuthMode('login');
    triggerToast('Successfully logged out.');
  };

  const [isAsking, setIsAsking] = useState(false);
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    const question = newQuestion.trim();
    if (!question || isAsking) return;
    setNewQuestion('');
    setIsAsking(true);
    let answer;
    try {
      answer = await chat([
        {
          role: 'system',
          content: 'You answer questions about one document using only its text. Quote exact figures and names when relevant. If the answer is not in the document, say so plainly. Keep answers under 150 words, no markdown tables.'
        },
        {
          role: 'user',
          content: `Document: ${selectedDoc.name}\n\nText:\n${excerpt(selectedDoc.content || selectedDoc.detailedSummary || '')}\n\nQuestion: ${question}`
        }
      ]);
    } catch (err) {
      answer = `Sorry, the AI couldn't answer right now (${err.message}).`;
    }
    setDocQuestions(prev => [...prev, { q: question, a: answer }]);
    setQuestionsCount(prev => prev + 1);
    setIsAsking(false);
  };

  const handleCompare = async () => {
    const itemA = documents.find(d => d.id === effA);
    const itemB = documents.find(d => d.id === effB);

    if (!itemA || !itemB || effA === effB) {
      triggerToast('Please select two DIFFERENT documents to compare.');
      return;
    }
    setCompareResult(null);
    triggerToast(`Comparing ${itemA.name} and ${itemB.name}...`);
    const textOf = (d) => excerpt(d.content || d.detailedSummary || d.briefSummary || '', 9000);
    try {
      const result = await chat([
        {
          role: 'system',
          content: 'Compare two documents strictly using only their text. Never invent facts, numbers or topics not present in either text; if the documents are unrelated, say so and give a low similarity. Return ONLY JSON: {"similarity": <0-100 integer>, "commonPoints": ["3-5 specific shared points"], "differences": ["3-5 specific differences naming which document"]}'
        },
        {
          role: 'user',
          content: `Document A: ${itemA.name}\n${textOf(itemA)}\n\n---\n\nDocument B: ${itemB.name}\n${textOf(itemB)}`
        }
      ], { json: true });
      setCompareResult({
        similarity: Math.max(0, Math.min(100, Math.round(Number(result.similarity) || 0))),
        commonPoints: result.commonPoints || [],
        differences: result.differences || []
      });
    } catch (err) {
      triggerToast(`Comparison failed: ${err.message}`);
    }
  };

  const handleBotSend = async (e) => {
    e.preventDefault();
    if (!botInput.trim()) return;
    const userMsg = botInput;
    setBotMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setBotInput('');

    try {
      const context = selectedDoc.name
        ? `The user is currently viewing "${selectedDoc.name}". Its text:\n${excerpt(selectedDoc.content || selectedDoc.detailedSummary || '', 8000)}`
        : 'The user has no document selected.';
      const botReply = await chat([
        { role: 'system', content: `You are the CloudDoc AI Assistant powered by GPT OSS 120B, a helpful general assistant. Answer any question the user asks directly and accurately, like a normal AI chatbot. Only when the question is about their document, use the document text below and answer strictly from it, quoting exact figures. You can also explain CloudDoc features (upload, adaptive reading, knowledge graph, gap detector, Ask Document, Compare Docs, Study Mode, File Converter for PDF/Word/PowerPoint/Excel/images). Keep answers clear and concise.\n\n${context}` },
        ...botMessages.slice(1).slice(-6).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: userMsg }
      ]);
      setBotMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setBotMessages(prev => [...prev, { sender: 'bot', text: `Sorry, I couldn't reach the AI (${err.message}). Please try again.` }]);
    }
  };

  // ----------------------------------------------------
  // AUTHENTICATION SCREEN
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
            {authMode === 'login' ? 'Enter your credentials to access your document workspace' : 'Register for an isolated cloud workspace (Starts with 0 files)'}
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

              {authMode === 'register' && user.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-slate-300">{passwordStrength.text}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: `${(passwordStrength.score / 3) * 100}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{authMode === 'login' ? 'Sign In to Workspace' : 'Create Isolated Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            {authMode === 'login' ? (
              <span>Don't have an account? <button onClick={() => setAuthMode('register')} className="text-indigo-400 font-medium hover:underline">Sign Up</button></span>
            ) : (
              <span>Already have an account? <button onClick={() => setAuthMode('login')} className="text-indigo-400 font-medium hover:underline">Log In</button></span>
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
              <span className="text-[10px] text-slate-400">GPT OSS 120B Powered</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: PieChart },
              { id: 'documents', label: 'My Documents', icon: FileText },
              { id: 'adaptive', label: 'Adaptive Reading', icon: Sliders },
              { id: 'graph', label: 'Knowledge Graph', icon: Network },
              { id: 'gaps', label: 'Gap Detector', icon: SearchCode },
              { id: 'ask', label: 'Ask Document', icon: MessageSquare },
              { id: 'compare', label: 'Compare Docs', icon: Layers },
              { id: 'study', label: 'Study Mode', icon: BookOpen },
              { id: 'convert', label: 'File Converter', icon: RefreshCw },
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
                  <h3 className="text-2xl font-bold mt-1">{memoryUsedMB} MB</h3>
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
                onClick={() => setActiveTab('adaptive')} 
                className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-xl text-left transition-all group"
              >
                <Sliders className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm">Adaptive Reading Mode</h4>
                <p className="text-xs text-slate-400 mt-1">Explain text across 4 levels: Beginner, College, Pro, or Expert.</p>
              </button>

              <button 
                onClick={() => setActiveTab('graph')} 
                className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-xl text-left transition-all group"
              >
                <Network className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm">Knowledge Graph & Mind Map</h4>
                <p className="text-xs text-slate-400 mt-1">Visualize document topics as interactive graph nodes.</p>
              </button>

              <button 
                onClick={() => setActiveTab('gaps')} 
                className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-xl text-left transition-all group"
              >
                <SearchCode className="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm">Knowledge Gap Detector</h4>
                <p className="text-xs text-slate-400 mt-1">Identify missing info, cost/security risks, and open questions.</p>
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

            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-indigo-500/40 bg-slate-900/50 hover:bg-slate-900 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-indigo-400"
            >
              <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-200">Click anywhere here to select files from your computer</p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, PPTX, TXT files (Processed by GPT OSS 120B)</p>
              <button 
                type="button" 
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Browse Files
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase">
                  <tr>
                    <th className="p-4">Document Name</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Date Added</th>
                    <th className="p-4">Tag</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 text-xs">
                        No documents found in your workspace. Click above to upload a file!
                      </td>
                    </tr>
                  ) : (
                    documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-semibold text-slate-100 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>{doc.name}</span>
                        </td>
                        <td className="p-4">{doc.sizeMB} MB</td>
                        <td className="p-4 text-slate-400">{doc.date}</td>
                        <td className="p-4">
                          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {doc.tag}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-max">
                            <Check className="w-3 h-3" />
                            <span>{doc.status}</span>
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { setSelectedDocId(doc.id); setActiveTab('gaps'); }}
                              className="p-1.5 hover:bg-slate-800 text-red-400 rounded" 
                              title="Knowledge Gap Analysis"
                            >
                              <SearchCode className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setSelectedDocId(doc.id); setActiveTab('ask'); }}
                              className="p-1.5 hover:bg-slate-800 text-indigo-400 rounded" 
                              title="Analyze Document"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDoc(doc.id)} 
                              className="p-1.5 hover:bg-slate-800 text-red-400 rounded" 
                              title="Delete File"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADAPTIVE READING MODE VIEW */}
        {activeTab === 'adaptive' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-indigo-400" />
                  <span>Adaptive Reading Mode</span>
                </h2>
                <p className="text-slate-400 text-sm">Explains the document tailored across 4 different complexity levels while preserving formulas and citations.</p>
              </div>

              {documents.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-medium">Select File:</label>
                  <select 
                    value={selectedDocId || ''} 
                    onChange={e => setSelectedDocId(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-medium px-3 py-2 rounded-lg focus:outline-none"
                  >
                    {documents.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
                <Sliders className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Please upload a document to enable Adaptive Reading Mode.</p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'beginner', label: 'Beginner', icon: BookOpen, desc: 'Simple analogies & zero jargon' },
                    { id: 'college', label: 'College Student', icon: GraduationCap, desc: 'Academic breakdown & definitions' },
                    { id: 'professional', label: 'Professional', icon: Briefcase, desc: 'Operational risks & SLA' },
                    { id: 'expert', label: 'Technical Expert', icon: Award, desc: 'In-depth code metrics & P95 latency' }
                  ].map(lvl => {
                    const Icon = lvl.icon;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => setReadingLevel(lvl.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          readingLevel === lvl.id 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2 text-indigo-400" />
                        <h4 className="font-bold text-xs text-slate-200">{lvl.label}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">{lvl.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                      Active Complexity Level: {readingLevel.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500">Document: {selectedDoc.name}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {selectedDoc.adaptiveReading?.[readingLevel] || selectedDoc.detailedSummary}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KNOWLEDGE GRAPH VIEW */}
        {activeTab === 'graph' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Network className="w-6 h-6 text-emerald-400" />
                <span>Interactive Knowledge Graph</span>
              </h2>
              <p className="text-slate-400 text-sm">Visualizes document topics as interconnected semantic node branches in real time.</p>
            </div>

            {documents.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
                <Network className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Upload a document to build interactive knowledge graphs.</p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6">
                <h3 className="text-sm font-bold text-slate-200">Semantic Node Relations for "{selectedDoc.name}"</h3>
                
                <div className="p-12 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-center gap-6 relative overflow-hidden">
                  <div className="p-4 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-2xl z-10 border border-indigo-400">
                    {selectedDoc.name}
                  </div>

                  {selectedDoc.graphNodes?.map((node, idx) => (
                    <div key={idx} className="flex items-center gap-3 animate-pulse">
                      <div className="w-8 h-0.5 bg-indigo-500/50"></div>
                      <div className="p-3 bg-slate-900 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold hover:border-indigo-400 cursor-pointer transition-all">
                        {node}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* KNOWLEDGE GAP DETECTOR VIEW */}
        {activeTab === 'gaps' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <SearchCode className="w-6 h-6 text-red-400" />
                  <span>Knowledge Gap Detector (GPT OSS 120B)</span>
                </h2>
                <p className="text-slate-400 text-sm">Identifies missing info, unanswered research questions, and recommendations to strengthen your reports.</p>
              </div>

              {documents.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-medium">Select File:</label>
                  <select 
                    value={selectedDocId || ''} 
                    onChange={e => setSelectedDocId(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-medium px-3 py-2 rounded-lg focus:outline-none"
                  >
                    {documents.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
                <SearchCode className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Please upload a document or research paper to run Knowledge Gap Detection.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Active Document</p>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{selectedDoc.name}</h3>
                  </div>
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-3 py-1 rounded-full font-medium">
                    GPT OSS 120B Audit Complete
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="font-bold text-sm">Missing Information</h3>
                    </div>
                    <p className="text-xs text-slate-400">Critical topics omitted in the document:</p>
                    <ul className="space-y-2 pt-2">
                      {selectedDoc.knowledgeGaps?.missingInfo?.map((item, idx) => (
                        <li key={idx} className="p-3 bg-slate-950 border border-red-500/20 rounded-lg text-xs text-slate-300 leading-relaxed">
                          • {item}
                        </li>
                      )) || <p className="text-xs text-slate-500">No major gaps detected.</p>}
                    </ul>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <HelpCircle className="w-5 h-5" />
                      <h3 className="font-bold text-sm">Unanswered Questions</h3>
                    </div>
                    <p className="text-xs text-slate-400">Open questions that remain unresolved:</p>
                    <ul className="space-y-2 pt-2">
                      {selectedDoc.knowledgeGaps?.unansweredQuestions?.map((item, idx) => (
                        <li key={idx} className="p-3 bg-slate-950 border border-amber-500/20 rounded-lg text-xs text-slate-300 leading-relaxed">
                          • {item}
                        </li>
                      )) || <p className="text-xs text-slate-500">No unresolved questions.</p>}
                    </ul>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Sparkles className="w-5 h-5" />
                      <h3 className="font-bold text-sm">Recommended Additions</h3>
                    </div>
                    <p className="text-xs text-slate-400">Actionable ways to strengthen the paper:</p>
                    <ul className="space-y-2 pt-2">
                      {selectedDoc.knowledgeGaps?.improvements?.map((item, idx) => (
                        <li key={idx} className="p-3 bg-slate-950 border border-emerald-500/20 rounded-lg text-xs text-slate-300 leading-relaxed">
                          • {item}
                        </li>
                      )) || <p className="text-xs text-slate-500">Document is well optimized.</p>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ASK DOCUMENT VIEW */}
        {activeTab === 'ask' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">AI Document Analysis & Q&A</h2>
                <p className="text-slate-400 text-sm">Deep-dive summaries, key takeaways, and question answering.</p>
              </div>

              {documents.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-medium">Select File:</label>
                  <select 
                    value={selectedDocId || ''} 
                    onChange={e => setSelectedDocId(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-medium px-3 py-2 rounded-lg focus:outline-none"
                  >
                    {documents.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Please upload a document to view AI Analysis and Summaries.</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-100">{selectedDoc.name}</h3>
                        <p className="text-xs text-slate-400">{selectedDoc.readTime} • {selectedDoc.wordCount} Words • Complexity: {selectedDoc.complexity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={handleCopySummary} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors" title="Copy Summary">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={handleDownloadSummary} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors" title="Download TXT Report">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[
                      { id: 'detailed', label: 'Detailed Analysis' },
                      { id: 'brief', label: 'Brief Summary' },
                      { id: 'takeaways', label: 'Key Takeaways' }
                    ].map(fmt => (
                      <button
                        key={fmt.id}
                        onClick={() => setSummaryFormat(fmt.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                          summaryFormat === fmt.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {summaryFormat === 'brief' && selectedDoc.briefSummary}
                    {summaryFormat === 'detailed' && selectedDoc.detailedSummary}
                    {summaryFormat === 'takeaways' && (
                      <ul className="list-disc pl-4 space-y-2 text-indigo-300">
                        {selectedDoc.keyTakeaways?.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                  <h3 className="font-bold text-sm text-slate-200">Ask Questions About "{selectedDoc.name}"</h3>
                  
                  <form onSubmit={handleAskQuestion} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask any question about this document..."
                      value={newQuestion}
                      onChange={e => setNewQuestion(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button type="submit" disabled={isAsking} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                      {isAsking ? 'Thinking...' : 'Ask AI'}
                    </button>
                  </form>

                  <div className="space-y-3 pt-2">
                    {docQuestions.map((qa, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800/60 rounded-lg space-y-1">
                        <p className="text-xs font-semibold text-indigo-400">Q: {qa.q}</p>
                        <p className="text-xs text-slate-300">A: {qa.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* COMPARE DOCUMENTS VIEW */}
        {activeTab === 'compare' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">Side-by-Side Document Comparison</h2>
              <p className="text-slate-400 text-sm">Analyze similarities, technical differences, and structural overlap between files.</p>
            </div>

            {documents.length < 2 ? (
              <div className="p-8 bg-slate-900 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
                Upload at least 2 documents to run the side-by-side comparative analysis.
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Select Document 1:</label>
                    <select 
                      value={effA ?? ''} 
                      onChange={e => setDocA(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg"
                    >
                      {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Select Document 2:</label>
                    <select 
                      value={effB ?? ''} 
                      onChange={e => setDocB(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg"
                    >
                      {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleCompare}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Run Semantic Comparison
                </button>

                {compareResult && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
                      <span className="text-xs font-semibold text-slate-200">Semantic Similarity Score:</span>
                      <span className="text-lg font-bold text-indigo-400">{compareResult.similarity}% Match</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase">Common Features & Overlap</h4>
                        <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                          {compareResult.commonPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                        </ul>
                      </div>

                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <h4 className="text-xs font-bold text-amber-400 uppercase">Key Differences</h4>
                        <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                          {compareResult.differences.map((pt, i) => <li key={i}>{pt}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

       {/* STUDY MODE VIEW - UNLIMITED & FULL TOPIC COVERAGE VIA GROQ */}
        {activeTab === 'study' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Study Mode & Revision</h2>
                <p className="text-slate-400 text-sm">Interactive flashcards and multiple-choice questions dynamically generated across all core document topics.</p>
              </div>

              {documents.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 font-medium">Select File:</label>
                    <select 
                      value={selectedDocId || ''} 
                      onChange={e => {
                        setSelectedDocId(Number(e.target.value));
                        setFlashcardIndex(0);
                        setShowAnswer(false);
                        setUserAnswers({});
                      }}
                      className="bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-medium px-3 py-2 rounded-lg focus:outline-none"
                    >
                      {documents.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={async () => {
                      if (!selectedDoc.name) return;
                      triggerToast(`Generating comprehensive study set for ${selectedDoc.name}...`);
                      try {
                        const studySet = await chat([
                            {
                              role: 'system',
                              content: `You are an expert academic professor creating an exhaustive exam revision set. 
Analyze the document titled "${selectedDoc.name}". 
Document text: ${excerpt(selectedDoc.content || '', 12000) || selectedDoc.detailedSummary || selectedDoc.briefSummary || ''}
Key Takeaways: ${selectedDoc.keyTakeaways?.join(', ') || 'N/A'}

Generate 5 deep-dive flashcards and 5 distinct multiple-choice questions covering every core topic, architectural layer, and specification in this document. Ensure ALL 4 options in each MCQ are plausible and topic-specific, and vary which option is correct (the "correct" index), instead of always 0.

Return ONLY a valid JSON object strictly formatted as:
{
  "flashcards": [
    {"question": "Deep concept question 1 about ${selectedDoc.name}?", "answer": "Comprehensive answer 1."},
    {"question": "Deep concept question 2 about ${selectedDoc.name}?", "answer": "Comprehensive answer 2."},
    {"question": "Deep concept question 3 about ${selectedDoc.name}?", "answer": "Comprehensive answer 3."},
    {"question": "Deep concept question 4 about ${selectedDoc.name}?", "answer": "Comprehensive answer 4."},
    {"question": "Deep concept question 5 about ${selectedDoc.name}?", "answer": "Comprehensive answer 5."}
  ],
  "mcqs": [
    {
      "id": 1,
      "question": "1st topic-specific question about ${selectedDoc.name}?",
      "options": ["Correct file-specific answer", "Plausible wrong option A", "Plausible wrong option B", "Plausible wrong option C"],
      "correct": 0
    },
    {
      "id": 2,
      "question": "2nd topic-specific question about ${selectedDoc.name}?",
      "options": ["Correct file-specific answer", "Plausible wrong option A", "Plausible wrong option B", "Plausible wrong option C"],
      "correct": 0
    },
    {
      "id": 3,
      "question": "3rd topic-specific question about ${selectedDoc.name}?",
      "options": ["Correct file-specific answer", "Plausible wrong option A", "Plausible wrong option B", "Plausible wrong option C"],
      "correct": 0
    },
    {
      "id": 4,
      "question": "4th topic-specific question about ${selectedDoc.name}?",
      "options": ["Correct file-specific answer", "Plausible wrong option A", "Plausible wrong option B", "Plausible wrong option C"],
      "correct": 0
    },
    {
      "id": 5,
      "question": "5th topic-specific question about ${selectedDoc.name}?",
      "options": ["Correct file-specific answer", "Plausible wrong option A", "Plausible wrong option B", "Plausible wrong option C"],
      "correct": 0
    }
  ]
}`
                            },
                            {
                              role: 'user',
                              content: `Generate comprehensive exam questions covering every section of: ${selectedDoc.name}`
                            }
                          ], { json: true });

                        const generatedStudy = studySet;
                        
                        // Update active document's studyMode state
                        setDocuments(prevDocs => prevDocs.map(doc => {
                          if (doc.id === selectedDoc.id) {
                            return { ...doc, studyMode: generatedStudy };
                          }
                          return doc;
                        }));

                        triggerToast('5 Flashcards & 5 MCQs Generated!');
                      } catch (err) {
                        console.error("Groq Study Mode Error:", err);
                        triggerToast('Error generating study set. Please try again.');
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate Full Exam Questions</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setActiveStudyTab('flashcards')}
                className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                  activeStudyTab === 'flashcards' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Flashcards ({selectedDoc.studyMode?.flashcards?.length || 0})
              </button>
              <button 
                onClick={() => setActiveStudyTab('mcqs')}
                className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                  activeStudyTab === 'mcqs' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Quiz / MCQs ({selectedDoc.studyMode?.mcqs?.length || 0})
              </button>
            </div>

            {activeStudyTab === 'flashcards' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-xl mx-auto text-center space-y-6">
                {(!selectedDoc.studyMode?.flashcards || selectedDoc.studyMode.flashcards.length === 0) ? (
                  <div className="py-8 space-y-3">
                    <p className="text-xs text-slate-400">No flashcards generated for this file yet. Click 'Generate Full Exam Questions' above!</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">
                      Card {flashcardIndex + 1} of {selectedDoc.studyMode.flashcards.length}
                    </p>
                    <div 
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="p-8 bg-slate-950 border border-indigo-500/30 rounded-xl cursor-pointer min-h-[160px] flex items-center justify-center text-sm font-semibold text-slate-200 hover:border-indigo-400 transition-all shadow-inner"
                    >
                      {showAnswer 
                        ? selectedDoc.studyMode.flashcards[flashcardIndex]?.answer 
                        : selectedDoc.studyMode.flashcards[flashcardIndex]?.question}
                    </div>
                    <p className="text-[11px] text-slate-500">Click card to flip between Question and Answer</p>

                    <div className="flex justify-between items-center pt-2">
                      <button 
                        disabled={flashcardIndex === 0}
                        onClick={() => { setFlashcardIndex(prev => prev - 1); setShowAnswer(false); }}
                        className="text-xs bg-slate-800 disabled:opacity-50 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Previous
                      </button>
                      <button 
                        disabled={flashcardIndex >= selectedDoc.studyMode.flashcards.length - 1}
                        onClick={() => { setFlashcardIndex(prev => prev + 1); setShowAnswer(false); }}
                        className="text-xs bg-indigo-600 disabled:opacity-50 px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                      >
                        Next Card
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeStudyTab === 'mcqs' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                {(!selectedDoc.studyMode?.mcqs || selectedDoc.studyMode.mcqs.length === 0) ? (
                  <p className="text-xs text-slate-400 text-center py-8">No quiz questions available for this file. Click 'Generate Full Exam Questions' above!</p>
                ) : (
                  selectedDoc.studyMode.mcqs.map((q) => (
                    <div key={q.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-slate-200">{q.id}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: oIdx })}
                            className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-all ${
                              userAnswers[q.id] === oIdx
                                ? oIdx === q.correct
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                  : 'bg-red-500/20 border-red-500/50 text-red-300'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {/* USER PROFILE VIEW */}
        {/* FILE CONVERTER VIEW */}
        {activeTab === 'convert' && <ConvertTab onToast={triggerToast} />}

        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">User Workspace Profile</h2>
              <p className="text-slate-400 text-sm">Account details and cloud workspace configurations.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg text-white">
                  {(user.fullName || user.email || 'U').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">{user.fullName || 'Active User'}</h3>
                  <p className="text-xs text-slate-400">{user.email || 'user@clouddoc.ai'}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Cloud Tier:</span>
                  <span className="font-semibold text-indigo-400">PaaS Developer Tier</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Storage Scope:</span>
                  <span className="font-semibold text-emerald-400">Multi-tenant User Isolated</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Indexed Files:</span>
                  <span className="font-semibold text-slate-200">{documents.length} Files</span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-medium py-2 rounded-lg text-xs transition-colors mt-4"
              >
                Sign Out of Cloud Account
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING CHATBOT ASSISTANT */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold pr-1">Ask AI</span>
          </button>
        ) : (
          <div className="w-80 h-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-3 bg-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">GPT OSS 120B Assistant</span>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {botMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded-xl text-xs max-w-[80%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleBotSend} className="p-2 border-t border-slate-800 flex gap-1 bg-slate-950">
              <input 
                type="text" 
                placeholder="Ask GPT OSS 120B..."
                value={botInput}
                onChange={e => setBotInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="bg-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold text-white">
                Send
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}