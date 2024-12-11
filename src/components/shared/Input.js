import { forwardRef } from "react";

const Input = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full appearance-none rounded-md border px-2.5 py-1.5 shadow-sm
          outline-none transition bg-white text-gray-900 placeholder-gray-400 focus:ring-2
          focus:ring-blue-200 focus:border-blue-500
          ${error ? "border-red-500" : "border-gray-300"}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
