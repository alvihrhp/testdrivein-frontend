"use client";

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Versi statis untuk preview tampilan toast
type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

const MOCK_TOASTS: Toast[] = [
  {
    id: '1',
    title: 'Notifikasi Berhasil',
    description: 'Ini adalah contoh notifikasi sukses',
    variant: 'default'
  },
  {
    id: '2',
    title: 'Terjadi Kesalahan',
    description: 'Ini adalah contoh notifikasi error',
    variant: 'destructive'
  }
];

type ToastContextType = {
  toast: (props: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
  }) => void;
  dismissToast: (id: string) => void;
  toasts: Toast[];
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(({
    title,
    description,
    variant = 'default',
    duration = 3000,
  }: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = React.useMemo(() => ({
    toast,
    dismissToast,
    toasts,
  }), [toast, dismissToast, toasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 max-w-sm w-full flex justify-between items-start',
              {
                'border-red-500': toast.variant === 'destructive',
                'border-gray-200 dark:border-gray-700': toast.variant !== 'destructive',
              }
            )}
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{toast.title}</h3>
              {toast.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              className="ml-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => dismissToast(toast.id)}
              aria-label="Close notification"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
