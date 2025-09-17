import React from 'react';
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';

type FormInputProps = {
  label: string;
  name: string;
  placeholder?: string;
  options?: RegisterOptions<FieldValues, string>;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  placeholder,
  type = 'text',
  options = {},
  ...props
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <div className="mb-2 w-full">
      <label
        htmlFor={name}
        className={`mb-1 block text-sm font-semibold ${errors[name] ? 'text-[#F31260]' : 'text-black '} `}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`
                ${errors[name] ? 'border-[#F31260]' : 'border-[#E4E4E7]'}
                flex h-10 w-full rounded-lg border-2 px-3 py-1 text-sm shadow-sm  hover:border-[#A1A1AA]  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#a1a1aa] focus-visible:outline-black  disabled:cursor-not-allowed disabled:opacity-50
                `}
        {...register(name, options)}
        {...props}
      />
      {errors[name] && (
        <span className="block pt-1 text-xs text-[#F31260]">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
