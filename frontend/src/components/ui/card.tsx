// src/components/ui/card.tsx
import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "", ...props }: Props) => {
  return (
    <div className={`bg-white rounded-xl shadow border ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "", ...props }: Props) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
