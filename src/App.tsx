import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { ProcessedDocument, DocumentClause } from '../App';

interface DocumentViewerProps {
  document: ProcessedDocument | null;
  highlightedClauses: DocumentClause[];
}

export default function DocumentViewer({ document, highlightedClauses }: DocumentViewerProps) {
  const [expandedClauses, setExpandedClauses] = useState<Set<number>>(new Set());

  const toggleClause = (index: number) => {
    setExpandedClauses(prev => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  if (!document) {
    return <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6" />;
  }

  if (document.status === 'processing') {
    return <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6" />;
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
      {/* Document Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <div
            className="whitespace-pre-line text-sm leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: highlightText(document.content || '') }}
          />
        </div>
      </div>

      {/* Referenced Clauses */}
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

                  {/* View More / View Less */}
                  <p className="text-sm text-gray-900 mb-2 leading-relaxed">
                    {expandedClauses.has(index)
                      ? clause.text
                      : clause.text.length > 200
                        ? clause.text.slice(0, 200) + '...'
                        : clause.text}
                    {clause.text.length > 200 && (
                      <button
                        onClick={() => toggleClause(index)}
                        className="ml-2 text-blue-600 text-xs underline"
                      >
                        {expandedClauses.has(index) ? 'View Less' : 'View More'}
                      </button>
                    )}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {clause.keywords.map(keyword => (
                      <span
                        key={keyword}
                        className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full hover:bg-blue-200 transition-colors"
                      >
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
