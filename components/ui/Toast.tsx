'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const bgColor = {
    success: 'bg-success/90',
    error: 'bg-red-500/90',
    warning: 'bg-warning/90',
    info: 'bg-primary/90',
  }[toast.type];

  const icon = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }[toast.type];

  return (
    <div
      className={`${bgColor} backdrop-blur-sm text-white rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-fade-in-up border border-white/10`}
      style={{
        animation: 'fadeInUp 0.3s ease-out',
        maxWidth: '420px'
      }}
    >
      <span className="material-symbols-outlined text-[24px] flex-shrink-0 mt-0.5">
        {icon}
      </span>
      <p className="flex-1 text-sm font-medium leading-relaxed break-words">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity mt-0.5"
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  );
}
