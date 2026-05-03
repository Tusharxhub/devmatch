"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Card({ children, className = "", onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/3 backdrop-blur-sm border border-white/5 rounded-2xl p-4 sm:p-5 transition-transform transform hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}
