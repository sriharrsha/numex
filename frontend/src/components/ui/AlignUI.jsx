import React from 'react';
import { cn } from '../../lib/utils';

// Button Component inspired by AlignUI
export const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "medium", 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-purple-500 shadow-sm hover:shadow-md",
    neutral: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    error: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm rounded-md",
    medium: "px-4 py-2 text-sm rounded-lg",
    large: "px-6 py-3 text-base rounded-lg",
    xlarge: "px-8 py-4 text-lg rounded-xl"
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

// Card Component inspired by AlignUI
export const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";

export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pb-4", className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-bold text-gray-900 leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 mt-2", className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = "CardContent";

// Input Component inspired by AlignUI
export const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border-2 bg-white px-3 py-2 text-sm transition-colors",
        "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error 
          ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
          : "border-gray-300 focus:border-purple-500 focus:ring-purple-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

// Textarea Component inspired by AlignUI
export const Textarea = React.forwardRef(({ 
  className, 
  error = false,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border-2 bg-white px-3 py-2 text-sm transition-colors",
        "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        error 
          ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
          : "border-gray-300 focus:border-purple-500 focus:ring-purple-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

// Select Component inspired by AlignUI
export const Select = ({ children, value, onValueChange, placeholder, className }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm",
          "focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
    </div>
  );
};

export const SelectOption = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// Badge Component inspired by AlignUI
export const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-purple-100 text-purple-800 border-purple-200",
    secondary: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

// Tabs Component inspired by AlignUI
export const Tabs = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn("w-full", className)}>
      <div data-tabs-value={value} data-tabs-onchange={onValueChange}>
        {children}
      </div>
    </div>
  );
};

export const TabsList = ({ children, className }) => (
  <div className={cn(
    "inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 p-1 text-gray-500 shadow-sm",
    className
  )}>
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, className, onClick, active }) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
      "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
      active 
        ? "bg-white text-gray-900 shadow-sm" 
        : "text-gray-600 hover:text-gray-900",
      className
    )}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children, className }) => {
  if (value !== activeTab) return null;
  
  return (
    <div className={cn("mt-6 focus:outline-none", className)}>
      {children}
    </div>
  );
};

// Label Component inspired by AlignUI
export const Label = React.forwardRef(({ className, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium text-gray-700 mb-2",
      className
    )}
    {...props}
  >
    {children}
  </label>
));

Label.displayName = "Label";