export default function Button({ children, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-blue-700 hover:bg-blue-800 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  };

  return (
    <button
      className={`px-3 py-1.5 rounded-md font-medium transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
