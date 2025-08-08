import React, { useRef } from 'react';
import { Upload, FileText, AlertCircle, Sparkles, Zap, Brain } from 'lucide-react';
import { ProcessedDocument } from '../App';

interface DocumentUploaderProps {
  documents: ProcessedDocument[];
  onUpload: (files: FileList) => void;
  onDocumentSelect: (document: ProcessedDocument) => void;
}

export default function DocumentUploader({ documents, onUpload, onDocumentSelect }: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Upload className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Smart Document Upload</h3>
          <p className="text-sm text-gray-600">AI-powered document processing & analysis</p>
        </div>
      </div>

      {/* Modern Upload Area */}
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-gray-50 to-white"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex flex-col items-center space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-base font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOCX, TXT • Up to 50MB • Batch processing available
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Real-time Processing</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Smart Extraction</span>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md,.json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 2025 Sample Documents */}
      {documents.length === 0 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Try 2025 Sample Documents</h4>
              <p className="text-sm text-blue-700 mb-4">
                Explore cutting-edge document types with our AI-powered analysis system.
              </p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    const file = new File([''], 'ai-ethics-policy-2025.pdf', { type: 'application/pdf' });
                    onUpload([file] as any);
                  }}
                  className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl text-sm font-medium text-blue-800 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>AI Ethics & Governance Policy</span>
                  </div>
                  <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">AI Governance</div>
                </button>
                
                <button
                  onClick={() => {
                    const file = new File([''], 'remote-work-contract-2025.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                    onUpload([file] as any);
                  }}
                  className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl text-sm font-medium text-blue-800 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Hybrid Work Agreement 2025</span>
                  </div>
                  <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">HR Policy</div>
                </button>
                
                <button
                  onClick={() => {
                    const file = new File([''], 'sustainability-compliance-2025.txt', { type: 'text/plain' });
                    onUpload([file] as any);
                  }}
                  className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl text-sm font-medium text-blue-800 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>ESG Compliance Report</span>
                  </div>
                  <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">ESG</div>
                </button>
                
                <button
                  onClick={() => {
                    const file = new File([''], 'crypto-defi-agreement-2025.pdf', { type: 'application/pdf' });
                    onUpload([file] as any);
                  }}
                  className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl text-sm font-medium text-blue-800 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>DeFi Participation Agreement</span>
                  </div>
                  <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">FinTech</div>
                </button>
                
                <button
                  onClick={() => {
                    const file = new File([''], 'quantum-security-policy-2025.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                    onUpload([file] as any);
                  }}
                  className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl text-sm font-medium text-blue-800 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Quantum-Safe Security Policy</span>
                  </div>
                  <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Cybersecurity</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}