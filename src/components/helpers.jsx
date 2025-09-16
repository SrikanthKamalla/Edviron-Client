import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div
    className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}
  >
    {children}
  </h3>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div
    className={`p-6 border-t border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

export const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white",
    secondary:
      "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600",
    ghost:
      "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white",
    link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline",
  };

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

export const Badge = ({ children, className = "" }) => (
  <span
    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            open,
            setOpen,
            value,
            onValueChange: (newValue) => {
              onValueChange(newValue);
              setOpen(false);
            },
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger = ({ children, open, setOpen, className = "" }) => (
  <button
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    onClick={() => setOpen(!open)}
  >
    {children}
    <svg
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""} opacity-50`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>
);

export const SelectValue = ({ children, placeholder }) => (
  <span className="truncate">{children || placeholder}</span>
);

export const SelectContent = ({ children, open, setOpen, className = "" }) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md ${className}`}
    >
      {children}
    </div>
  );
};

export const SelectItem = ({
  value: itemValue,
  children,
  onValueChange,
  className = "",
}) => (
  <div
    onClick={() => {
      onValueChange(itemValue);
    }}
    className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
  >
    {children}
  </div>
);

export const Table = ({ children, className = "" }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

export const TableHeader = ({ children, className = "" }) => (
  <thead className={className}>{children}</thead>
);

export const TableBody = ({ children, className = "" }) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow = ({ children, className = "" }) => (
  <tr className={`border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = "" }) => (
  <th
    className={`text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = "", colSpan }) => (
  <td className={`py-3 px-4 ${className}`} colSpan={colSpan}>
    {children}
  </td>
);

export const Alert = ({ children, className = "" }) => (
  <div
    className={`relative w-full rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}
  >
    {children}
  </div>
);

export const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);

export const Dialog = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const DialogTrigger = ({ children, ...props }) => {
  return React.cloneElement(children, props);
};

export const DialogContent = ({ children, className = "" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 bg-black/50" />
    <div
      className={`z-50 max-w-4xl w-full max-h-[80vh] overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {children}
    </div>
  </div>
);

export const DialogHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const DialogTitle = ({ children, className = "" }) => (
  <h2
    className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}
  >
    {children}
  </h2>
);

export const DialogDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 mt-2 ${className}`}>
    {children}
  </p>
);
