import { useEffect, useRef, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mouseDownTargetRef = useRef<EventTarget | null>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 md:m-auto w-full md:max-w-lg rounded-none md:rounded-xl bg-white dark:bg-slate-900 shadow-2xl border-0 md:border border-slate-200 dark:border-slate-700 backdrop:bg-black/30 backdrop:backdrop-blur-md p-0 overflow-hidden"
      onClose={onClose}
      onMouseDown={(e) => { mouseDownTargetRef.current = e.target; }}
      onClick={(e) => {
        if (e.target === dialogRef.current && mouseDownTargetRef.current === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="p-4 md:p-6 max-h-[calc(100dvh-64px)] md:max-h-[70vh] overflow-y-auto">{children}</div>
    </dialog>
  );
}
