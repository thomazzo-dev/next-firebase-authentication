import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errorMessage?: string;
}

export default function Input({
  name,
  errorMessage,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        name={name}
        className="  px-2 rounded-md w-full h-10  input"
        {...rest}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
