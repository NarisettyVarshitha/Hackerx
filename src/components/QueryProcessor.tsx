import React, { useState } from 'react';
import { Search, Brain, Zap, ArrowRight, Sparkles, MessageSquare, Wand2 } from 'lucide-react';

interface QueryProcessorProps {
  onQuerySubmit: (query: string) => void;
  isProcessing: boolean;
  documentsAvailable: boolean;
}

const modernSampleQueries = [
  "Can our AI model be deployed without bias testing? Check compliance with 2025 ethics policy",
  "Employee wants to work 5 days remote - what does our hybrid work agreement allow?",
  "Investment in crypto mining company - does this align with our ESG sustainability goals?",
  "When should we implement post-quantum cryptography for our payment systems?",
  "New AI hiring tool shows 15% bias against women - what's our policy response?",
  "Remote employee in different timezone - what are core collaboration requirements?",
  "Carbon offset purchase of $500K - does this meet our net zero commitments?",
  "DeFi yield farming with 10% of treasury - what are the risk limits?"
];

export default function QueryProcessor({ onQuerySubmit, isProcessing, documentsAvailable }: QueryProcessorProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: '🔍' },
    { id: 'ai', name: 'AI Ethics', icon: '🤖' },
    { id: 'work', name: 'Remote Work', icon: '🏠' },
    { id: 'esg', name: 'Sustainability', icon: '🌱' },
    { id: 'crypto', name: 'DeFi/Crypto', icon: '₿' },
    { id: 'security', name: 'Quantum Security', icon: '🔐' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && documentsAvailable) {
      onQuerySubmit(query.trim());
    }
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
    if (documentsAvailable) {
      onQuerySubmit(sampleQuery);
    }
  };

  const getFilteredQueries = () => {
    if (selectedCategory === 'all') return modernSampleQueries;
    
    const categoryFilters = {
      ai: ['AI', 'bias', 'model', 'ethics'],
      work: ['remote', 'employee', 'work', 'hybrid'],
      esg: ['ESG', 'carbon', 'sustainability', 'offset'],
      crypto: ['crypto', 'DeFi', 'treasury', 'yield'],
      security: ['quantum', 'cryptography', 'security', 'payment']
    };
    
    const filters = categoryFilters[selectedCategory as keyof typeof categoryFilters] || [];
    return modernSampleQueries.filter(query => 
      filters.some(filter => query.toLowerCase().includes(filter.toLowerCase()))
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Query Processor</h3>
          <p className="text-sm text-gray-600">Natural language document analysis</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your documents in natural language..."
            className="w-full p-4 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm transition-all duration-200"
            rows={4}
            disabled={isProcessing}
          />
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            {query.length > 0 && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {query.length} chars
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {documentsAvailable ? (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Zap className="h-4 w-4" />
                <span>AI Ready</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm text-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <Zap className="h-4 w-4" />
                <span>Upload documents first</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Sparkles className="h-3 w-3" />
              <span>GPT-4 Powered</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || !documentsAvailable || isProcessing}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              documentsAvailable && query.trim() && !isProcessing
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Brain className="h-4 w-4 animate-pulse" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Analyze</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modern Sample Queries */}
      {!isProcessing && (
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-semibold text-gray-900">Sample Queries for 2025</h4>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {getFilteredQueries().length} available
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
            {getFilteredQueries().map((sampleQuery, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(sampleQuery)}
                disabled={!documentsAvailable}
                className={`text-left p-4 rounded-xl text-sm transition-all duration-200 group ${
                  documentsAvailable
                    ? 'bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    documentsAvailable ? 'bg-blue-400 group-hover:bg-purple-400' : 'bg-gray-300'
                  }`}></div>
                  <span className={documentsAvailable ? 'text-gray-700 group-hover:text-gray-900' : 'text-gray-400'}>
                    {sampleQuery}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Processing Animation */}
      {isProcessing && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">AI Processing Your Query...</p>
              <div className="text-xs text-blue-700 space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Parsing natural language query</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
                  <span>Semantic document search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1000ms' }}></div>
                  <span>Generating intelligent response</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white/50 rounded-xl">
              <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}