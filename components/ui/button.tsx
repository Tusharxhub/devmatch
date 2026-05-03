"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
};

export default function Button({ children, onClick, className = "", type = "button", fullWidth = true }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 bg-gradient-to-r from-violet-600 to-cyan-500 text-white ${fullWidth ? "w-full" : "w-auto sm:inline-flex"} ${className}`}
    >
      {children}
    </button>
  );
}
