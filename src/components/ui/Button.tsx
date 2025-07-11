import { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500',
      outline:
        'border border-gray-200 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-400',
      ghost: 'bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400 border border-transparent hover:border-gray-200',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 py-2 px-4',
      lg: 'h-11 px-8 text-lg',
    };

    const buttonContent = isLoading ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </>
    ) : (
      children
    );

    const buttonProps = {
      className: twMerge(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      ),
      disabled: disabled || isLoading,
      ...props,
    };

    return (
      <Comp
        ref={ref}
        {...buttonProps}
      >
        {buttonContent}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
