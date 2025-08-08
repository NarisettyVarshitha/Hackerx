import React, { useState } from 'react';
import { Brain, FileText, BarChart3, Eye, Sparkles } from 'lucide-react';
import DocumentUploader from './components/DocumentUploader';
import QueryProcessor from './components/QueryProcessor';
import ResultsDisplay from './components/ResultsDisplay';
import DocumentViewer from './components/DocumentViewer';
import AnalyticsPanel from './components/AnalyticsPanel';

export interface DocumentClause {
  id: string;
  text: string;
  section: string;
  keywords: string[];
  relevanceScore: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface ProcessedDocument {
  id: string;
  name: string;
  content?: string;
  status: 'processing' | 'completed' | 'error';
  category?: string;
  riskScore?: number;
  aiSummary?: string;
  clauses: DocumentClause[];
  uploadedAt: Date;
}

export interface QueryResult {
  id: string;
  query: string;
  decision: 'approved' | 'rejected' | 'requires_review' | 'pending';
  confidence: number;
  justification: string;
  amount?: number;
  processingTime: number;
  referencedClauses: DocumentClause[];
  recommendations?: string[];
  nextSteps?: string[];
  riskAssessment?: {
    score: number;
    factors: string[];
  };
}

// Sample document contents for demonstration
const SAMPLE_DOCUMENTS = {
  'ai-ethics-policy-2025.pdf': {
    content: `AI ETHICS & GOVERNANCE POLICY 2025

SECTION 1: AI MODEL DEPLOYMENT REQUIREMENTS
1.1 Bias Testing Mandate
All AI models must undergo comprehensive bias testing before deployment. This includes:
- Gender bias assessment with minimum 95% fairness score
- Racial bias evaluation across all demographic groups  
- Age discrimination testing for hiring and lending models
- Regular monitoring post-deployment with quarterly reviews

1.2 Ethical AI Standards
- Models showing >5% bias against protected classes are prohibited from deployment
- Explainable AI requirements for all decision-making systems
- Human oversight mandatory for high-stakes decisions (hiring, lending, healthcare)
- Data privacy compliance with GDPR and emerging AI regulations

SECTION 2: COMPLIANCE REQUIREMENTS
2.1 Documentation Standards
- Complete model documentation including training data sources
- Bias testing reports with statistical significance testing
- Regular audit trails and decision logging
- Third-party validation for critical applications

2.2 Deployment Approval Process
- Ethics committee review for all AI systems
- Stakeholder impact assessment
- Risk mitigation strategies documented
- Continuous monitoring protocols established`,
    category: 'AI Governance',
    riskScore: 0.3,
    aiSummary: 'Comprehensive AI ethics policy requiring bias testing, human oversight, and continuous monitoring for all AI deployments.'
  },
  
  'remote-work-contract-2025.docx': {
    content: `HYBRID WORK AGREEMENT 2025

SECTION 1: REMOTE WORK ELIGIBILITY
1.1 Standard Remote Work Policy
Employees are eligible for remote work arrangements based on role requirements:
- Individual contributors: Up to 4 days remote per week
- Team leads: Minimum 2 days in office for collaboration
- Senior management: Minimum 3 days in office for strategic alignment

1.2 Full Remote Work Exceptions
Full remote work (5 days) may be approved for:
- Employees with documented medical conditions
- Roles that are fully digital with no physical requirements
- Exceptional performers with manager approval
- Temporary arrangements during personal circumstances (max 6 months)

SECTION 2: COLLABORATION REQUIREMENTS
2.1 Core Hours and Availability
- All employees must be available during core hours: 10 AM - 3 PM local time
- Response time expectations: 4 hours for non-urgent, 1 hour for urgent matters
- Weekly team meetings mandatory (virtual or in-person)
- Quarterly in-person team building events required

2.2 Digital Wellness Standards
- Right to disconnect: No work communications after 7 PM or weekends
- Mental health support: Access to counseling and wellness programs
- Ergonomic home office setup allowance: $1,500 annually
- Technology stipend: $200 monthly for internet and utilities`,
    category: 'HR Policy',
    riskScore: 0.2,
    aiSummary: 'Modern hybrid work policy allowing up to 4 days remote with exceptions for full remote work, emphasizing collaboration and digital wellness.'
  },

  'sustainability-compliance-2025.txt': {
    content: `ESG COMPLIANCE REPORT 2025

CARBON NEUTRALITY COMMITMENTS
Our organization has committed to achieving net-zero carbon emissions by 2030. Current initiatives include:

RENEWABLE ENERGY TRANSITION
- 85% renewable energy usage across all facilities
- Solar panel installations completed at 12 major offices
- Wind energy contracts signed for manufacturing plants
- Target: 100% renewable energy by 2026

CARBON OFFSET INVESTMENTS
Investment Guidelines:
- Minimum $500,000 annual investment in verified carbon offset projects
- Focus on nature-based solutions: reforestation, wetland restoration
- Technology-based offsets: direct air capture, renewable energy projects
- Third-party verification required for all offset purchases
- Maximum 30% of emissions can be offset (70% must be direct reduction)

SUSTAINABLE SUPPLY CHAIN
- All suppliers must meet ESG criteria by 2025
- Carbon footprint reporting mandatory for top 100 suppliers
- Preference for local suppliers to reduce transportation emissions
- Circular economy principles: 90% waste diversion from landfills

INVESTMENT RESTRICTIONS
The following investments are prohibited under our ESG policy:
- Fossil fuel companies (oil, gas, coal)
- Companies with poor labor practices
- Organizations with significant environmental violations
- Businesses involved in deforestation or habitat destruction`,
    category: 'ESG Compliance',
    riskScore: 0.4,
    aiSummary: 'Comprehensive ESG policy with net-zero commitments, carbon offset requirements, and strict investment restrictions for sustainability.'
  },

  'crypto-defi-agreement-2025.pdf': {
    content: `DEFI PARTICIPATION AGREEMENT 2025

SECTION 1: TREASURY MANAGEMENT POLICY
1.1 Cryptocurrency Investment Limits
The organization may allocate treasury funds to cryptocurrency investments under strict guidelines:
- Maximum 15% of total treasury in cryptocurrency assets
- Bitcoin and Ethereum: Up to 10% combined allocation
- DeFi protocols: Maximum 5% allocation with additional risk controls
- Stablecoin reserves: Minimum 2% for operational liquidity

1.2 DeFi Yield Farming Guidelines
Yield farming activities are permitted with the following restrictions:
- Maximum 10% of treasury funds in yield farming protocols
- Only protocols with >$1B TVL and 6+ months operational history
- Smart contract audits required from reputable firms (Certik, OpenZeppelin)
- Maximum 20% APY targets (higher yields indicate excessive risk)
- Diversification across minimum 3 different protocols

SECTION 2: RISK MANAGEMENT
2.1 Due Diligence Requirements
Before participating in any DeFi protocol:
- Technical audit of smart contracts
- Team background verification and doxxed founders preferred
- Tokenomics analysis and sustainability assessment
- Liquidity analysis and exit strategy planning

2.2 Risk Limits and Controls
- Daily monitoring of positions and protocol health
- Automatic position reduction if protocol TVL drops >50%
- Maximum 30-day lock-up periods for staked assets
- Emergency exit procedures documented and tested
- Insurance coverage for smart contract risks where available`,
    category: 'FinTech Policy',
    riskScore: 0.7,
    aiSummary: 'DeFi participation policy allowing up to 10% treasury allocation in yield farming with strict risk controls and due diligence requirements.'
  },

  'quantum-security-policy-2025.docx': {
    content: `QUANTUM-SAFE SECURITY POLICY 2025

SECTION 1: POST-QUANTUM CRYPTOGRAPHY TRANSITION
1.1 Implementation Timeline
Organizations must prepare for quantum computing threats to current cryptographic systems:
- 2025: Assessment of current cryptographic infrastructure
- 2026: Pilot implementation of quantum-resistant algorithms
- 2027: Full migration of critical systems to post-quantum cryptography
- 2028: Complete organizational transition to quantum-safe protocols

1.2 Priority Systems for Migration
High-priority systems requiring immediate quantum-safe upgrades:
- Payment processing systems and financial transactions
- Customer data encryption and storage systems
- Internal communications and email encryption
- API security and authentication systems
- Blockchain and cryptocurrency wallet security

SECTION 2: QUANTUM-RESISTANT ALGORITHMS
2.1 Approved Cryptographic Standards
The following NIST-approved post-quantum algorithms are authorized:
- CRYSTALS-Kyber for key encapsulation mechanisms
- CRYSTALS-Dilithium for digital signatures
- FALCON for compact digital signatures
- SPHINCS+ for stateless hash-based signatures

2.2 Implementation Requirements
- Hybrid approach: Run classical and post-quantum algorithms in parallel
- Regular security assessments and algorithm updates
- Staff training on quantum cryptography concepts
- Vendor assessment for quantum-safe compliance
- Budget allocation: Minimum $2M annually for quantum security upgrades`,
    category: 'Cybersecurity',
    riskScore: 0.5,
    aiSummary: 'Quantum-safe security policy outlining post-quantum cryptography transition timeline and approved algorithms for critical systems.'
  }
};

function App() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null);
  const [highlightedClauses, setHighlightedClauses] = useState<DocumentClause[]>([]);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'query' | 'results' | 'analytics'>('upload');

  // Simulate document processing
  const processDocument = (file: File): ProcessedDocument => {
    const sampleDoc = SAMPLE_DOCUMENTS[file.name as keyof typeof SAMPLE_DOCUMENTS];
    
    if (sampleDoc) {
      // Extract clauses from content
      const clauses: DocumentClause[] = [];
      const sections = sampleDoc.content.split('SECTION');
      
      sections.forEach((section, index) => {
        if (section.trim()) {
          const lines = section.split('\n').filter(line => line.trim());
          lines.forEach((line, lineIndex) => {
            if (line.length > 50 && !line.match(/^[\d.]+\s/)) {
              clauses.push({
                id: `${file.name}-${index}-${lineIndex}`,
                text: line.trim(),
                section: `Section ${index}`,
                keywords: extractKeywords(line),
                relevanceScore: Math.random() * 0.5 + 0.5,
                sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
                riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
              });
            }
          });
        }
      });

      return {
        id: Date.now().toString(),
        name: file.name,
        content: sampleDoc.content,
        status: 'completed',
        category: sampleDoc.category,
        riskScore: sampleDoc.riskScore,
        aiSummary: sampleDoc.aiSummary,
        clauses,
        uploadedAt: new Date()
      };
    }

    // For non-sample documents, create a basic structure
    return {
      id: Date.now().toString(),
      name: file.name,
      content: 'Document content would be extracted here...',
      status: 'completed',
      category: 'General',
      riskScore: Math.random(),
      clauses: [],
      uploadedAt: new Date()
    };
  };

  const extractKeywords = (text: string): string[] => {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'];
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5);
  };

  const handleUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Add processing document first
      const processingDoc: ProcessedDocument = {
        id: Date.now().toString(),
        name: file.name,
        status: 'processing',
        clauses: [],
        uploadedAt: new Date()
      };
      
      setDocuments(prev => [...prev, processingDoc]);

      // Simulate processing delay
      setTimeout(() => {
        const processedDoc = processDocument(file);
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === processingDoc.id ? processedDoc : doc
          )
        );
      }, 2000 + Math.random() * 3000);
    });
  };

  const processQuery = (query: string) => {
    setIsProcessingQuery(true);
    const startTime = Date.now();

    // Simulate AI processing
    setTimeout(() => {
      const result = analyzeQuery(query);
      const processingTime = Date.now() - startTime;
      
      const queryResult: QueryResult = {
        ...result,
        id: Date.now().toString(),
        query,
        processingTime
      };

      setQueryResults(prev => [queryResult, ...prev]);
      setHighlightedClauses(result.referencedClauses);
      setIsProcessingQuery(false);
      setActiveTab('results');
    }, 3000 + Math.random() * 2000);
  };

  const analyzeQuery = (query: string): Omit<QueryResult, 'id' | 'query' | 'processingTime'> => {
    const lowerQuery = query.toLowerCase();
    const completedDocs = documents.filter(d => d.status === 'completed');
    let relevantClauses: DocumentClause[] = [];
    
    // Find relevant clauses based on query content
    completedDocs.forEach(doc => {
      doc.clauses.forEach(clause => {
        const clauseText = clause.text.toLowerCase();
        const queryWords = lowerQuery.split(/\s+/);
        const matches = queryWords.filter(word => 
          clauseText.includes(word) || 
          clause.keywords.some(keyword => keyword.toLowerCase().includes(word))
        );
        
        if (matches.length > 0) {
          relevantClauses.push({
            ...clause,
            relevanceScore: matches.length / queryWords.length
          });
        }
      });
    });

    // Sort by relevance
    relevantClauses = relevantClauses
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    // Generate decision based on query type and content
    let decision: QueryResult['decision'] = 'pending';
    let justification = '';
    let amount: number | undefined;
    let recommendations: string[] = [];
    let nextSteps: string[] = [];
    let riskAssessment: QueryResult['riskAssessment'];

    // AI Ethics queries
    if (lowerQuery.includes('ai') && (lowerQuery.includes('bias') || lowerQuery.includes('deploy'))) {
      if (lowerQuery.includes('without bias testing')) {
        decision = 'rejected';
        justification = 'AI model deployment without bias testing violates our AI Ethics Policy. All models must undergo comprehensive bias testing with minimum 95% fairness score before deployment.';
        recommendations = [
          'Conduct comprehensive bias testing across all demographic groups',
          'Ensure fairness score meets minimum 95% threshold',
          'Document testing results and mitigation strategies'
        ];
        nextSteps = [
          'Schedule bias testing with AI ethics team',
          'Prepare model documentation and training data sources',
          'Plan post-deployment monitoring protocols'
        ];
        riskAssessment = {
          score: 0.8,
          factors: ['Regulatory compliance risk', 'Reputational damage', 'Discrimination liability']
        };
      } else {
        decision = 'approved';
        justification = 'AI deployment approved following proper bias testing and ethics review protocols.';
      }
    }
    
    // Remote work queries
    else if (lowerQuery.includes('remote') || lowerQuery.includes('work from home')) {
      if (lowerQuery.includes('5 days') || lowerQuery.includes('full remote')) {
        decision = 'requires_review';
        justification = 'Full remote work (5 days) requires special approval. Standard policy allows up to 4 days remote. Exceptions available for medical conditions, exceptional performers, or fully digital roles.';
        recommendations = [
          'Review employee performance history',
          'Assess role requirements for physical presence',
          'Consider temporary arrangement with review period'
        ];
        nextSteps = [
          'Manager to evaluate request against policy exceptions',
          'HR review for compliance with hybrid work standards',
          'Document approval rationale if granted'
        ];
        riskAssessment = {
          score: 0.3,
          factors: ['Team collaboration impact', 'Performance monitoring challenges']
        };
      } else {
        decision = 'approved';
        justification = 'Remote work request approved under standard hybrid work policy allowing up to 4 days remote per week.';
      }
    }
    
    // ESG/Investment queries
    else if (lowerQuery.includes('investment') || lowerQuery.includes('esg') || lowerQuery.includes('carbon')) {
      if (lowerQuery.includes('crypto') || lowerQuery.includes('mining')) {
        decision = 'requires_review';
        justification = 'Crypto mining investment conflicts with ESG sustainability goals. Our policy prohibits investments in high-energy consumption activities that contradict carbon neutrality commitments.';
        recommendations = [
          'Consider alternative sustainable investment options',
          'Review ESG compliance requirements',
          'Explore renewable energy-powered crypto operations'
        ];
        riskAssessment = {
          score: 0.7,
          factors: ['ESG policy violation', 'Carbon footprint increase', 'Stakeholder reputation risk']
        };
      } else if (lowerQuery.includes('carbon offset') || lowerQuery.includes('500')) {
        decision = 'approved';
        amount = 500000;
        justification = 'Carbon offset investment of $500K approved. Meets minimum annual investment requirement and aligns with net-zero commitments.';
      }
    }
    
    // DeFi/Crypto queries
    else if (lowerQuery.includes('defi') || lowerQuery.includes('yield') || lowerQuery.includes('treasury')) {
      if (lowerQuery.includes('10%')) {
        decision = 'approved';
        justification = 'DeFi yield farming with 10% of treasury approved. Within policy limits of maximum 10% allocation with required risk controls and due diligence.';
        recommendations = [
          'Ensure protocols have >$1B TVL and 6+ months history',
          'Verify smart contract audits from reputable firms',
          'Implement daily monitoring and risk controls'
        ];
        nextSteps = [
          'Complete technical audit of target protocols',
          'Set up automated monitoring systems',
          'Document emergency exit procedures'
        ];
        riskAssessment = {
          score: 0.6,
          factors: ['Smart contract risk', 'Market volatility', 'Liquidity risk']
        };
      }
    }
    
    // Quantum security queries
    else if (lowerQuery.includes('quantum') || lowerQuery.includes('cryptography')) {
      decision = 'approved';
      justification = 'Post-quantum cryptography implementation approved for payment systems. Aligns with 2025-2028 transition timeline for critical systems.';
      recommendations = [
        'Implement NIST-approved algorithms (CRYSTALS-Kyber, Dilithium)',
        'Use hybrid approach with classical and post-quantum algorithms',
        'Allocate budget for quantum security upgrades'
      ];
    }
    
    // Insurance/Medical queries (legacy support)
    else if (lowerQuery.match(/\d+.*male|male.*\d+/) || lowerQuery.includes('surgery') || lowerQuery.includes('insurance')) {
      decision = 'approved';
      amount = 150000;
      justification = 'Medical procedure approved. Knee surgery is covered under the policy for eligible members with active coverage.';
    }
    
    // Default case
    else {
      decision = 'requires_review';
      justification = 'Query requires manual review. Unable to determine automatic decision based on available policy documents.';
    }

    return {
      decision,
      confidence: 0.85 + Math.random() * 0.1,
      justification,
      amount,
      referencedClauses: relevantClauses,
      recommendations,
      nextSteps,
      riskAssessment
    };
  };

  const handleDocumentSelect = (document: ProcessedDocument) => {
    setSelectedDocument(document);
    setActiveTab('query');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                <p className="text-sm text-gray-600">Intelligent Document Analysis Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Online</span>
              </div>
              <div className="text-sm text-gray-500">
                {documents.length} docs • {queryResults.length} queries
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1 mb-8">
          {[
            { id: 'upload', label: 'Document Library', icon: FileText },
            { id: 'query', label: 'AI Query', icon: Brain },
            { id: 'results', label: 'Results', icon: Eye },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.id === 'results' && queryResults.length > 0 && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    {queryResults.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'upload' && (
              <DocumentUploader
                documents={documents}
                onUpload={handleUpload}
                onDocumentSelect={handleDocumentSelect}
              />
            )}

            {activeTab === 'query' && (
              <QueryProcessor
                onQuerySubmit={processQuery}
                isProcessing={isProcessingQuery}
                documentsAvailable={documents.some(d => d.status === 'completed')}
              />
            )}

            {activeTab === 'results' && (
              <div className="space-y-6">
                {queryResults.length === 0 ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                    <div className="p-6 bg-gray-100 rounded-2xl mb-4 inline-block">
                      <Sparkles className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
                    <p className="text-gray-600">Submit a query to see AI-powered analysis results</p>
                  </div>
                ) : (
                  queryResults.map(result => (
                    <ResultsDisplay key={result.id} result={result} query={result.query} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPanel documents={documents} queryResults={queryResults} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DocumentViewer
              document={selectedDocument}
              highlightedClauses={highlightedClauses}
            />

            {/* Document List */}
            {documents.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Library</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {documents.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleDocumentSelect(doc)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                        selectedDocument?.id === doc.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          doc.status === 'completed' ? 'bg-green-100 text-green-700' :
                          doc.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      {doc.category && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {doc.category}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;