import { useEffect, useRef, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className="dialog" onClose={onClose}>
      <div className="dialog-header">
        <h2>{title}</h2>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="dialog-body">{children}</div>
    </dialog>
  );
}
