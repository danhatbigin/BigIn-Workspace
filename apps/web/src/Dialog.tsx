import { useEffect, useRef, type ReactNode } from 'react';
export function Dialog({ children, titleId, className = '', onCancel }: { children: ReactNode; titleId: string; className?: string; onCancel: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current!; dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId} className={className} onCancel={event => { event.preventDefault(); onCancel(); }}>
    {children}
  </dialog>;
}
