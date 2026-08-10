import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    let currentScrollY = 0;
    if (isOpen) {
      currentScrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (currentScrollY) {
        window.scrollTo(0, currentScrollY);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Top-Aligned Modal Container */}
      <div className="fixed inset-0 pointer-events-none flex items-start justify-center p-4 sm:p-6 pt-8 sm:pt-12 z-10">
        {/* Dialog Box */}
        <div className={`pointer-events-auto relative w-full ${maxWidth} max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up`}>
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body - Scrollable */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex-shrink-0 p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
