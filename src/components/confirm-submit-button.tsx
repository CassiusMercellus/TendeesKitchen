"use client";

/**
 * Wraps a Server Action form with a native confirm() gate — for a destructive
 * or hard-to-undo action (cancel, delete), not routine ones (advance, toggle).
 */
export function ConfirmSubmitButton({
  action,
  confirmMessage,
  className,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
