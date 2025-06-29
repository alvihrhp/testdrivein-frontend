import * as React from 'react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

type InputVariant = 'default' | 'error' | 'success';

type InputBaseProps = {
  label?: string;
  description?: string;
  error?: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
};

type SelectOption = {
  value: string | number;
  label: string;
};

type InputProps = InputBaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    as?: 'input';
    options?: never;
  };

type SelectProps = InputBaseProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
    as: 'select';
    options: SelectOption[];
    placeholder?: string;
  };

type TextareaProps = InputBaseProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
    as: 'textarea';
    options?: never;
  };

type InputComponentProps = InputProps | SelectProps | TextareaProps;

const variantStyles = {
  default: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
  error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
  success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
};

const Input = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, InputComponentProps>(
  ({
    label,
    description,
    error,
    className,
    variant = 'default',
    leftIcon,
    rightIcon,
    containerClassName,
    as: Component = 'input',
    options,
    ...props
  }, ref) => {
    const inputVariant = error ? 'error' : variant;
    const inputClassName = cn(
      'block w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2',
      variantStyles[inputVariant],
      {
        'pl-10': leftIcon,
        'pr-10': rightIcon,
      },
      className
    );

    const renderInput = () => {
      if (Component === 'select') {
        const selectProps = props as SelectProps;
        return (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={cn(inputClassName, 'appearance-none')}
            {...selectProps}
          >
            {selectProps.placeholder && (
              <option value="" disabled>
                {selectProps.placeholder}
              </option>
            )}
            {selectProps.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      if (Component === 'textarea') {
        const textareaProps = props as TextareaProps;
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={cn(inputClassName, 'min-h-[100px]')}
            {...textareaProps}
          />
        );
      }

      const inputProps = props as InputProps;
      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={inputClassName}
          {...inputProps}
        />
      );
    };

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftIcon}
            </div>
          )}
          {renderInput()}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { SelectOption };
