import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2";

    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300",
      outline:
        "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100",
      ghost: "text-gray-700 hover:bg-gray-100 disabled:text-gray-400",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
        {...props}
      >
        {loading ? <span className="animate-spin">⟳</span> : children}
      </button>
    );
  },
);

Button.displayName = "Button";
