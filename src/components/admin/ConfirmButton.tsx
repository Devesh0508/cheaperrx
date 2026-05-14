"use client";

import { useRef } from "react";

interface ConfirmButtonProps {
  message: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps a submit button with a window.confirm dialog.
 * Used inside Server Component forms so the action only fires after confirmation.
 */
export function ConfirmButton({ message, className, children }: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
