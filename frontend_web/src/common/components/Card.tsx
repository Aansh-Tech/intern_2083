import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-200 bg-white p-6 transition-colors
        hover:border-indigo-300
        dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
}
