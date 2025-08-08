import React, { useState } from 'react';
import { Upload, Search, FileText, Brain, CheckCircle, XCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import DocumentUploader from './components/DocumentUploader';
import QueryProcessor from './components/QueryProcessor';
import ResultsDisplay from './components/ResultsDisplay';
import DocumentViewer from './components/DocumentViewer';
import AnalyticsPanel from './components/AnalyticsPanel';

export interface ProcessedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'processing' | 'completed' | 'error';
  content?: string;
  clauses?: DocumentClause[];
  aiSummary?: string;
  riskScore?: number;
  category?: string;
}

export interface DocumentClause {
  id: string;
  text: string;
  section: string;
  relevanceScore: number;
  keywords: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface QueryResult {
  decision: 'approved' | 'rejected' | 'pending' | 'requires_review';
  amount?: number;
  confidence: number;
  justification: string;
  referencedClauses: DocumentClause[];
  processingTime: number;
  riskAssessment?: {
    score: number;
    factors: string[];
  };
  recommendations?: string[];
  nextSteps?: string[];
}

function App() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'analytics'>('documents');

  const handleDocumentUpload = (files: FileList) => {
    const newDocuments: ProcessedDocument[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'processing'
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Simulate AI document processing
    newDocuments.forEach(doc => {
      setTimeout(() => {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id 
            ? {
                ...d,
                status: 'completed',
                content: getSampleContent(doc.name),
                clauses: getSampleClauses(doc.name),
                aiSummary: getAISummary(doc.name),
                riskScore: getRiskScore(doc.name),
                category: getDocumentCategory(doc.name)
              }
            : d
        ));
      }, 2000 + Math.random() * 3000);
    });
  };

  const handleQuerySubmit = async (query: string) => {
    setCurrentQuery(query);
    setIsProcessing(true);
    
    // Simulate advanced LLM processing
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    const result = processAdvancedQuery(query, documents);
    setQueryResult(result);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  DocuMind AI
                </h1>
                <p className="text-sm text-gray-600">Next-Gen Document Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'documents'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Analytics
                </button>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">AI Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'documents' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Document Upload & Management */}
            <div className="xl:col-span-1 space-y-6">
              <DocumentUploader 
                documents={documents}
                onUpload={handleDocumentUpload}
                onDocumentSelect={setSelectedDocument}
              />
              
              {documents.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Document Library</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Sparkles className="h-4 w-4" />
                      <span>AI Processed</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {documents.map(doc => (
                      <div 
                        key={doc.id}
                        className="group flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <FileText className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            {doc.status === 'completed' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                              {doc.name}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {(doc.size / 1024).toFixed(1)} KB
                              </span>
                              {doc.category && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  {doc.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.riskScore && (
                            <div className={`w-2 h-2 rounded-full ${
                              doc.riskScore < 0.3 ? 'bg-green-400' :
                              doc.riskScore < 0.7 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></div>
                          )}
                          {doc.status === 'processing' && (
                            <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
                          )}
                          {doc.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {doc.status === 'error' && (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Middle Column - Query Processing */}
            <div className="xl:col-span-1 space-y-6">
              <QueryProcessor 
                onQuerySubmit={handleQuerySubmit}
                isProcessing={isProcessing}
                documentsAvailable={documents.some(d => d.status === 'completed')}
              />

              {queryResult && (
                <ResultsDisplay 
                  result={queryResult}
                  query={currentQuery}
                />
              )}
            </div>

            {/* Right Column - Document Viewer */}
            <div className="xl:col-span-1">
              <DocumentViewer 
                document={selectedDocument}
                highlightedClauses={queryResult?.referencedClauses || []}
              />
            </div>
          </div>
        ) : (
          <AnalyticsPanel documents={documents} queryResults={queryResult ? [queryResult] : []} />
        )}
      </div>
    </div>
  );
}

// Enhanced helper functions for 2025 document types
function getSampleContent(fileName: string): string {
  const sampleContents = {
    'ai-ethics-policy-2025.pdf': `
AI ETHICS AND GOVERNANCE POLICY 2025

Section 1: AI Model Deployment Standards
All AI models deployed in production must undergo bias testing and fairness evaluation.
- Large Language Models (LLMs) require monthly bias audits
- Computer Vision models need demographic parity testing
- Recommendation systems must demonstrate equal opportunity metrics

Section 2: Data Privacy and AI Training
Personal data used for AI training must comply with:
- GDPR Article 22 (Automated Decision Making)
- California Consumer Privacy Act (CCPA) 2.0
- EU AI Act compliance requirements
- Biometric data requires explicit consent with 6-month retention limits

Section 3: Algorithmic Transparency
Decision-making algorithms must provide:
- Explainable AI outputs for high-risk decisions
- Model confidence scores above 85% for automated approvals
- Human oversight for decisions affecting >$10,000 or legal status

Section 4: AI Safety Protocols
- Red team testing required for all generative AI systems
- Continuous monitoring for model drift and performance degradation
- Incident response plan for AI system failures or biased outputs
    `,
    'remote-work-contract-2025.docx': `
HYBRID WORK AGREEMENT 2025

Article 1: Flexible Work Arrangements
Employees may work remotely up to 4 days per week with mandatory in-office collaboration days.
- Core collaboration hours: 10 AM - 3 PM local time
- Async work permitted outside core hours
- VR meeting participation counts as in-person for team building

Article 2: Digital Wellness Standards
- Right to disconnect: No work communications after 7 PM local time
- Mental health days: 2 additional days per quarter
- Ergonomic home office stipend: $2,000 annually
- Digital eye strain coverage included in health benefits

Article 3: Performance Metrics
Remote work performance measured by:
- Output quality and deadline adherence (70%)
- Team collaboration scores (20%)
- Innovation contributions (10%)
- Location independence does not affect promotion eligibility

Article 4: Technology Requirements
- Company-provided laptop with AI productivity tools
- High-speed internet reimbursement up to $100/month
- Cybersecurity training mandatory quarterly
- Personal device separation required for data protection
    `,
    'sustainability-compliance-2025.txt': `
CORPORATE SUSTAINABILITY COMPLIANCE REPORT 2025

Carbon Neutrality Commitments:
- Scope 1 & 2 emissions: Net zero by 2026
- Scope 3 emissions: 50% reduction by 2027
- Renewable energy: 100% by end of 2025
- Carbon offset verification through blockchain ledger

ESG Investment Criteria:
- Minimum ESG score of 7.5/10 for all investments
- Divest from fossil fuel companies by Q2 2025
- 30% allocation to green bonds and sustainable funds
- Impact measurement using UN SDG framework

Supply Chain Transparency:
- All Tier 1 suppliers must provide carbon footprint data
- Conflict mineral certification required
- Living wage verification for manufacturing partners
- Circular economy principles in packaging (90% recyclable)

Regulatory Compliance:
- EU Taxonomy Regulation alignment
- SEC Climate Disclosure Rules compliance
- TCFD reporting framework implementation
- Science-based targets validation by SBTi
    `,
    'crypto-defi-agreement-2025.pdf': `
DECENTRALIZED FINANCE (DeFi) PARTICIPATION AGREEMENT 2025

Section 1: Digital Asset Management
Authorized DeFi protocols for corporate treasury:
- Ethereum-based lending platforms (Aave, Compound)
- Decentralized exchanges (Uniswap V4, 1inch)
- Liquid staking protocols (Lido, Rocket Pool)
- Maximum exposure: 5% of total treasury per protocol

Section 2: Smart Contract Risk Management
- Multi-signature wallet requirements (3-of-5 threshold)
- Smart contract audits mandatory before deployment
- Insurance coverage through Nexus Mutual or similar
- Real-time monitoring of protocol governance changes

Section 3: Regulatory Compliance
- MiCA (Markets in Crypto-Assets) regulation compliance
- Tax reporting for all DeFi transactions
- KYC/AML procedures for counterparty verification
- Stablecoin reserves must be 1:1 backed and audited monthly

Section 4: Yield Farming Guidelines
- Maximum leverage ratio: 2:1
- Diversification across minimum 5 protocols
- Impermanent loss protection strategies required
- Quarterly rebalancing based on risk assessment
    `,
    'quantum-security-policy-2025.docx': `
QUANTUM-SAFE CRYPTOGRAPHY TRANSITION PLAN 2025

Phase 1: Risk Assessment (Q1-Q2 2025)
- Inventory all cryptographic implementations
- Identify quantum-vulnerable systems and data
- Prioritize critical infrastructure and sensitive data
- Timeline: Complete by June 30, 2025

Phase 2: Post-Quantum Cryptography Implementation
- NIST-approved algorithms: CRYSTALS-Kyber, CRYSTALS-Dilithium
- Hybrid approach during transition period
- Key management system upgrades
- Performance impact assessment and optimization

Phase 3: Legacy System Migration
- Gradual replacement of RSA and ECC implementations
- Backward compatibility maintenance for 24 months
- Third-party vendor quantum-readiness verification
- Employee training on quantum security concepts

Quantum Computing Preparedness:
- Monitor quantum computing advances quarterly
- Establish partnerships with quantum research institutions
- Budget allocation: $2M for quantum-safe infrastructure
- Incident response plan for quantum breakthrough scenarios
    `
  };
  
  return sampleContents[fileName as keyof typeof sampleContents] || 'Advanced document content for 2025 use cases...';
}

function getSampleClauses(fileName: string): DocumentClause[] {
  const clauseData = {
    'ai-ethics-policy-2025.pdf': [
      {
        id: '1',
        text: 'Large Language Models (LLMs) require monthly bias audits',
        section: 'Section 1: AI Model Deployment Standards',
        relevanceScore: 0.95,
        keywords: ['LLM', 'bias', 'audit', 'monthly'],
        sentiment: 'neutral',
        riskLevel: 'medium'
      },
      {
        id: '2',
        text: 'Model confidence scores above 85% for automated approvals',
        section: 'Section 3: Algorithmic Transparency',
        relevanceScore: 0.88,
        keywords: ['confidence', 'automated', 'approval', '85%'],
        sentiment: 'positive',
        riskLevel: 'low'
      }
    ],
    'remote-work-contract-2025.docx': [
      {
        id: '3',
        text: 'Employees may work remotely up to 4 days per week',
        section: 'Article 1: Flexible Work Arrangements',
        relevanceScore: 0.92,
        keywords: ['remote', 'work', '4 days', 'week'],
        sentiment: 'positive',
        riskLevel: 'low'
      },
      {
        id: '4',
        text: 'Right to disconnect: No work communications after 7 PM local time',
        section: 'Article 2: Digital Wellness Standards',
        relevanceScore: 0.85,
        keywords: ['disconnect', 'communications', '7 PM', 'wellness'],
        sentiment: 'positive',
        riskLevel: 'low'
      }
    ]
  };
  
  return clauseData[fileName as keyof typeof clauseData] || [];
}

function getAISummary(fileName: string): string {
  const summaries = {
    'ai-ethics-policy-2025.pdf': 'Comprehensive AI governance framework covering bias testing, privacy compliance, and safety protocols for enterprise AI deployment.',
    'remote-work-contract-2025.docx': 'Modern hybrid work agreement emphasizing digital wellness, flexible arrangements, and performance-based evaluation.',
    'sustainability-compliance-2025.txt': 'Corporate sustainability roadmap with carbon neutrality targets, ESG investment criteria, and regulatory compliance framework.',
    'crypto-defi-agreement-2025.pdf': 'DeFi participation guidelines covering risk management, regulatory compliance, and quantum-safe security measures.',
    'quantum-security-policy-2025.docx': 'Strategic plan for transitioning to post-quantum cryptography with phased implementation and risk mitigation.'
  };
  
  return summaries[fileName as keyof typeof summaries] || 'AI-generated document summary';
}

function getRiskScore(fileName: string): number {
  const riskScores = {
    'ai-ethics-policy-2025.pdf': 0.3,
    'remote-work-contract-2025.docx': 0.2,
    'sustainability-compliance-2025.txt': 0.4,
    'crypto-defi-agreement-2025.pdf': 0.8,
    'quantum-security-policy-2025.docx': 0.6
  };
  
  return riskScores[fileName as keyof typeof riskScores] || 0.5;
}

function getDocumentCategory(fileName: string): string {
  const categories = {
    'ai-ethics-policy-2025.pdf': 'AI Governance',
    'remote-work-contract-2025.docx': 'HR Policy',
    'sustainability-compliance-2025.txt': 'ESG Compliance',
    'crypto-defi-agreement-2025.pdf': 'FinTech',
    'quantum-security-policy-2025.docx': 'Cybersecurity'
  };
  
  return categories[fileName as keyof typeof categories] || 'General';
}

function processAdvancedQuery(query: string, documents: ProcessedDocument[]): QueryResult {
  const availableDocs = documents.filter(d => d.status === 'completed');
  
  if (availableDocs.length === 0) {
    return {
      decision: 'pending',
      confidence: 0.1,
      justification: 'No processed documents available for analysis.',
      referencedClauses: [],
      processingTime: 1500,
      recommendations: ['Upload relevant documents to proceed with analysis']
    };
  }

  const queryLower = query.toLowerCase();
  
  // Advanced query processing for 2025 scenarios
  const hasAI = /ai|artificial intelligence|llm|machine learning|algorithm/.test(queryLower);
  const hasRemoteWork = /remote|hybrid|work from home|flexible/.test(queryLower);
  const hasSustainability = /carbon|esg|sustainability|green|climate/.test(queryLower);
  const hasCrypto = /crypto|defi|blockchain|bitcoin|ethereum/.test(queryLower);
  const hasQuantum = /quantum|post-quantum|cryptography|security/.test(queryLower);

  const allClauses = availableDocs.flatMap(d => d.clauses || []);
  const relevantClauses = allClauses.filter(clause => 
    clause.keywords.some(keyword => queryLower.includes(keyword.toLowerCase()))
  );

  let decision: 'approved' | 'rejected' | 'pending' | 'requires_review' = 'pending';
  let amount = 0;
  let confidence = 0.75;
  let justification = '';
  let riskAssessment = { score: 0.3, factors: ['Standard compliance check'] };
  let recommendations: string[] = [];
  let nextSteps: string[] = [];

  if (hasAI && relevantClauses.length > 0) {
    decision = 'requires_review';
    confidence = 0.87;
    justification = 'AI implementation requires bias audit and compliance review per 2025 AI Ethics Policy.';
    riskAssessment = { score: 0.4, factors: ['Bias testing required', 'Regulatory compliance'] };
    recommendations = ['Conduct monthly bias audits', 'Implement explainable AI features'];
    nextSteps = ['Schedule ethics review meeting', 'Prepare compliance documentation'];
  } else if (hasRemoteWork && relevantClauses.length > 0) {
    decision = 'approved';
    confidence = 0.92;
    justification = 'Remote work arrangement approved under 2025 Hybrid Work Agreement guidelines.';
    riskAssessment = { score: 0.2, factors: ['Low risk - established policy'] };
    recommendations = ['Ensure digital wellness compliance', 'Set up ergonomic home office'];
    nextSteps = ['Complete remote work setup', 'Schedule quarterly check-in'];
  }

  return {
    decision,
    amount,
    confidence,
    justification,
    referencedClauses: relevantClauses.slice(0, 3),
    processingTime: 3200,
    riskAssessment,
    recommendations,
    nextSteps
  };
}

export default App;