'use client';

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({ isVisible, message = "Loading..." }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Darkened background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
        {/* Circular progress indicator */}
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <div className="absolute inset-0 rounded-full border-2 border-indigo-200 animate-pulse"></div>
        </div>

        {/* Loading message */}
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          {message}
        </p>

        {/* Loading dots animation */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
