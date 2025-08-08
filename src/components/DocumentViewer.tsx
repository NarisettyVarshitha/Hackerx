import React from 'react';
import { FileText, Eye, AlertCircle, Sparkles, Brain, Search, BookOpen } from 'lucide-react';
import { ProcessedDocument, DocumentClause } from '../App';

interface DocumentViewerProps {
  document: ProcessedDocument | null;
  highlightedClauses: DocumentClause[];
}

export default function DocumentViewer({ document, highlightedClauses }: DocumentViewerProps) {
  if (!document) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Smart Document Viewer</h3>
            <p className="text-sm text-gray-600">AI-powered document analysis & insights</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
          <div className="text-center">
            <div className="p-6 bg-gray-100 rounded-2xl mb-4 inline-block">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-600 mb-2">No Document Selected</p>
            <p className="text-sm text-gray-500">Choose a document from the library to view its contents</p>
          </div>
        </div>
      </div>
    );
  }

  if (document.status === 'processing') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
            <Brain className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Processing Document</h3>
            <p className="text-sm text-gray-600">{document.name}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-80 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-200 border-t-yellow-500 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-lg font-medium text-yellow-800 mb-2">AI Processing Document</p>
            <div className="space-y-1 text-sm text-yellow-700">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Extracting text and structure</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Identifying key clauses</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>Generating AI summary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const highlightText = (text: string) => {
    if (highlightedClauses.length === 0) return text;

    let highlightedText = text;
    highlightedClauses.forEach((clause, index) => {
      const regex = new RegExp(clause.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      highlightedText = highlightedText.replace(
        regex,
        `<mark class="bg-gradient-to-r from-yellow-200 to-yellow-300 px-2 py-1 rounded-lg border border-yellow-300" data-clause="${index}">${clause.text}</mark>`
      );
    });
    
    return highlightedText;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">Smart Document Viewer</h3>
              <p className="text-sm text-gray-600 truncate">{document.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {document.category && (
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {document.category}
              </span>
            )}
            {document.riskScore !== undefined && (
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                document.riskScore < 0.3 ? 'bg-green-100 text-green-700' :
                document.riskScore < 0.7 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  document.riskScore < 0.3 ? 'bg-green-500' :
                  document.riskScore < 0.7 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <span>Risk: {Math.round(document.riskScore * 100)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {document.aiSummary && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">AI-Generated Summary</h4>
              <p className="text-sm text-blue-800 leading-relaxed">{document.aiSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Highlighted Clauses Alert */}
      {highlightedClauses.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800 mb-1">Smart Highlighting Active</p>
              <p className="text-xs text-yellow-700">
                {highlightedClauses.length} clause(s) referenced in the AI analysis are highlighted below with enhanced visual indicators.
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Search className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-700">{highlightedClauses.length} matches</span>
            </div>
          </div>
        </div>
      )}

      {/* Document Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <div 
            className="whitespace-pre-line text-sm leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: highlightText(document.content || '') }}
          />
        </div>
      </div>

      {/* Enhanced Referenced Clauses List */}
      {highlightedClauses.length > 0 && (
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Referenced Clauses</span>
            </h4>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {highlightedClauses.length} clauses • AI analyzed
            </div>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {highlightedClauses.map((clause, index) => (
              <div 
                key={clause.id}
                className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {clause.section}
                    </p>
                    <div className="flex items-center space-x-2">
                      {clause.sentiment && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          clause.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          clause.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {clause.sentiment}
                        </span>
                      )}
                      <div className="flex items-center space-x-1">
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${clause.relevanceScore * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {Math.round(clause.relevanceScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 mb-2 leading-relaxed">{clause.text}</p>
                  <div className="flex flex-wrap gap-1">
                    {clause.keywords.map(keyword => (
                      <span key={keyword} className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full hover:bg-blue-200 transition-colors">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}