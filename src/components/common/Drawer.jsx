import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';

export const Drawer = ({ isOpen, onClose, title, children, stickyHeader, footer }) => {
  const contentRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const checkScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const hasScroll = scrollHeight > clientHeight + 10;
    setCanScroll(hasScroll);
    setIsAtTop(scrollTop < 20);
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 20);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    let currentScrollY = 0;
    if (isOpen) {
      currentScrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      checkScroll();
      const timer1 = setTimeout(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
        checkScroll();
      }, 50);
      const timer2 = setTimeout(checkScroll, 300);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (currentScrollY) {
        window.scrollTo(0, currentScrollY);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-10">
        <div className="relative w-screen max-w-full sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-fade-in">

          {/* Drawer Title Bar */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 flex-shrink-0">
            {/* Back Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 transition-all touch-manipulation min-h-[40px] font-semibold text-xs sm:text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Back</span>
            </button>

            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[180px] sm:max-w-[240px] text-center px-1">
              {title}
            </h3>

            {/* X Close Button */}
            <button
              onClick={onClose}
              aria-label="Close Drawer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sticky Header Content if provided */}
          {stickyHeader && (
            <div className="p-3.5 sm:p-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/80 backdrop-blur-md z-10 flex-shrink-0">
              {stickyHeader}
            </div>
          )}

          {/* Scrollable Content Body */}
          <div
            ref={contentRef}
            onScroll={checkScroll}
            className="flex-1 p-4 sm:p-6 overflow-y-auto relative scroll-smooth"
          >
            {children}
          </div>

          {/* Floating Scroll Navigation Buttons inside Drawer */}
          {canScroll && (
            <div className="absolute bottom-20 right-4 sm:right-6 z-30 flex flex-col gap-2 pointer-events-auto">
              {!isAtTop && (
                <button
                  onClick={scrollToTop}
                  title="Scroll to Top of Roster"
                  aria-label="Scroll to Top"
                  className="p-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md flex items-center justify-center min-h-[42px] min-w-[42px] border border-slate-700/50 dark:border-slate-200"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
              )}
              {!isAtBottom && (
                <button
                  onClick={scrollToBottom}
                  title="Scroll to Bottom of Roster"
                  aria-label="Scroll to Bottom"
                  className="p-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md flex items-center justify-center min-h-[42px] min-w-[42px]"
                >
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                </button>
              )}
            </div>
          )}

          {/* Fixed Footer */}
          {footer ? (
            <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 z-20 flex-shrink-0">
              {footer}
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 z-20 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:border-orange-300 hover:text-orange-600 transition-all touch-manipulation font-semibold text-xs sm:text-sm min-h-[44px] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Close Roster
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
