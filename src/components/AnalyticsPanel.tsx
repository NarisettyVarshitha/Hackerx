import React from 'react';
import { BarChart3, TrendingUp, Shield, FileText, Brain, AlertTriangle, CheckCircle, Clock, PieChart } from 'lucide-react';
import { ProcessedDocument, QueryResult } from '../App';

interface AnalyticsPanelProps {
  documents: ProcessedDocument[];
  queryResults: QueryResult[];
}

export default function AnalyticsPanel({ documents, queryResults }: AnalyticsPanelProps) {
  const completedDocs = documents.filter(d => d.status === 'completed');
  const avgRiskScore = completedDocs.length > 0 
    ? completedDocs.reduce((sum, doc) => sum + (doc.riskScore || 0), 0) / completedDocs.length 
    : 0;

  const categoryStats = completedDocs.reduce((acc, doc) => {
    const category = doc.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskDistribution = completedDocs.reduce((acc, doc) => {
    const risk = doc.riskScore || 0;
    if (risk < 0.3) acc.low++;
    else if (risk < 0.7) acc.medium++;
    else acc.high++;
    return acc;
  }, { low: 0, medium: 0, high: 0 });

  const decisionStats = queryResults.reduce((acc, result) => {
    acc[result.decision] = (acc[result.decision] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Document intelligence insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Real-time Analytics</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{completedDocs.length} processed</span>
            <span className="text-gray-500 ml-2">• {documents.length - completedDocs.length} pending</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
              <p className="text-3xl font-bold text-gray-900">{Math.round(avgRiskScore * 100)}%</p>
            </div>
            <div className={`p-3 rounded-xl ${
              avgRiskScore < 0.3 ? 'bg-green-100' :
              avgRiskScore < 0.7 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Shield className={`h-6 w-6 ${
                avgRiskScore < 0.3 ? 'text-green-600' :
                avgRiskScore < 0.7 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  avgRiskScore < 0.3 ? 'bg-green-500' :
                  avgRiskScore < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${avgRiskScore * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Queries</p>
              <p className="text-3xl font-bold text-gray-900">{queryResults.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">Processing active</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-3xl font-bold text-gray-900">
                {queryResults.length > 0 
                  ? Math.round(queryResults.reduce((sum, r) => sum + r.confidence, 0) / queryResults.length * 100)
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <span className="font-medium">High accuracy</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document Categories */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Document Categories</h3>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count], index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
              const percentage = (count / completedDocs.length) * 100;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
            <Shield className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">Low Risk</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${completedDocs.length > 0 ? (riskDistribution.low / completedDocs.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{riskDistribution.low}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium text-gray-700">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: `${completedDocs.length > 0 ? (riskDistribution.medium / completedDocs.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{riskDistribution.medium}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-700">High Risk</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: `${completedDocs.length > 0 ? (riskDistribution.high / completedDocs.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{riskDistribution.high}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Analysis */}
      {queryResults.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">AI Decision Analysis</h3>
            <Brain className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(decisionStats).map(([decision, count]) => {
              const icons = {
                approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
                rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
                pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                requires_review: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' }
              };
              
              const config = icons[decision as keyof typeof icons] || icons.pending;
              const Icon = config.icon;
              
              return (
                <div key={decision} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 ${config.bg} rounded-lg`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {decision.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Document Activity</h3>
        
        <div className="space-y-4">
          {documents.slice(-5).reverse().map((doc, index) => (
            <div key={doc.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className={`p-2 rounded-lg ${
                doc.status === 'completed' ? 'bg-green-100' :
                doc.status === 'processing' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <FileText className={`h-4 w-4 ${
                  doc.status === 'completed' ? 'text-green-600' :
                  doc.status === 'processing' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    doc.status === 'completed' ? 'bg-green-100 text-green-700' :
                    doc.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {doc.status}
                  </span>
                  {doc.category && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {doc.category}
                    </span>
                  )}
                </div>
              </div>
              
              {doc.riskScore !== undefined && (
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  doc.riskScore < 0.3 ? 'bg-green-100 text-green-700' :
                  doc.riskScore < 0.7 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {Math.round(doc.riskScore * 100)}% risk
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}