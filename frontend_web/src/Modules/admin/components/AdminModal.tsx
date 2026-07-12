import type { ReactNode } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function AdminModal({ open, title, onClose, children }: AdminModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
}