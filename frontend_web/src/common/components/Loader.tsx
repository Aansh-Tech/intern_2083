interface LoaderProps {
  label?: string;
}

export function Loader({ label = "Loading…" }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <div
        role="status"
        aria-label={label}
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}