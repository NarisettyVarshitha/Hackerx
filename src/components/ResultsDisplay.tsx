import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, MapPin, Calendar, User, Shield, TrendingUp, Lightbulb, ArrowRight, Target } from 'lucide-react';
import { QueryResult } from '../App';

interface ResultsDisplayProps {
  result: QueryResult;
  query: string;
}

export default function ResultsDisplay({ result, query }: ResultsDisplayProps) {
  const getDecisionIcon = () => {
    switch (result.decision) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'requires_review':
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getDecisionColor = () => {
    switch (result.decision) {
      case 'approved':
        return 'from-green-500 to-emerald-500';
      case 'rejected':
        return 'from-red-500 to-rose-500';
      case 'requires_review':
        return 'from-orange-500 to-amber-500';
      case 'pending':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getDecisionBadge = () => {
    const badges = {
      approved: { text: 'Approved', bg: 'bg-green-100', text_color: 'text-green-800' },
      rejected: { text: 'Rejected', bg: 'bg-red-100', text_color: 'text-red-800' },
      requires_review: { text: 'Requires Review', bg: 'bg-orange-100', text_color: 'text-orange-800' },
      pending: { text: 'Pending', bg: 'bg-yellow-100', text_color: 'text-yellow-800' }
    };
    
    const badge = badges[result.decision] || badges.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text_color}`}>
        {badge.text}
      </span>
    );
  };

  const getRiskColor = (score: number) => {
    if (score < 0.3) return 'text-green-600 bg-green-100';
    if (score < 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      {/* Modern Header */}
      <div className={`p-6 bg-gradient-to-r ${getDecisionColor()} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              {getDecisionIcon()}
            </div>
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold capitalize">{result.decision.replace('_', ' ')}</h3>
                {getDecisionBadge()}
              </div>
              <div className="flex items-center space-x-4 text-white/90 text-sm">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{result.processingTime}ms</span>
                </div>
              </div>
            </div>
          </div>
          {result.amount && result.amount > 0 && (
            <div className="text-right text-white">
              <p className="text-3xl font-bold">₹{result.amount.toLocaleString()}</p>
              <p className="text-white/90 text-sm">Approved Amount</p>
            </div>
          )}
        </div>
      </div>

      {/* Risk Assessment */}
      {result.riskAssessment && (
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Risk Assessment</h4>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.riskAssessment.score)}`}>
              {Math.round(result.riskAssessment.score * 100)}% Risk Score
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Risk Factors</p>
              <div className="space-y-1">
                {result.riskAssessment.factors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    result.riskAssessment.score < 0.3 ? 'bg-green-500' :
                    result.riskAssessment.score < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.riskAssessment.score * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Justification */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <Target className="h-4 w-4" />
          <span>AI Decision Analysis</span>
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          {result.justification}
        </p>

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>AI Recommendations</span>
            </h5>
            <div className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-800 flex-1">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {result.nextSteps && result.nextSteps.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <ArrowRight className="h-4 w-4 text-green-500" />
              <span>Next Steps</span>
            </h5>
            <div className="space-y-2">
              {result.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-green-600" />
                  </div>
                  <p className="text-sm text-green-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referenced Clauses */}
        {result.referencedClauses.length > 0 && (
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Referenced Document Clauses</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {result.referencedClauses.length} found
              </span>
            </h5>
            <div className="space-y-4">
              {result.referencedClauses.map((clause, index) => (
                <div key={clause.id} className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {clause.section}
                      </span>
                      {clause.sentiment && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          clause.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          clause.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {clause.sentiment}
                        </span>
                      )}
                      {clause.riskLevel && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          clause.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                          clause.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {clause.riskLevel} risk
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Relevance</div>
                      <div className="flex items-center space-x-1">
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${clause.relevanceScore * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {Math.round(clause.relevanceScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">{clause.text}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {clause.keywords.map(keyword => (
                      <span key={keyword} className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300 transition-colors">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-gray-900">{result.processingTime}ms</div>
              <div className="text-xs text-gray-500">Processing Time</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-gray-900">{result.referencedClauses.length}</div>
              <div className="text-xs text-gray-500">Clauses Analyzed</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-gray-900">{Math.round(result.confidence * 100)}%</div>
              <div className="text-xs text-gray-500">AI Confidence</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-gray-900">
                {result.riskAssessment ? Math.round(result.riskAssessment.score * 100) : 'N/A'}%
              </div>
              <div className="text-xs text-gray-500">Risk Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}