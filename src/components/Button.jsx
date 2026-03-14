import { cva } from 'class-variance-authority';
import React from 'react'
import { twMerge } from 'tailwind-merge';
export const buttonStyles = cva(["transition-colors"], {
  variants: {
    variant: {
      default: ["bg-white", "text-orange-default", 'hover:border border-orange-default'],
      ghost: ["bg-gray-bg", "text-gray-500"],
      find: [
        "bg-orange-default",
        "hover:bg-orange-dark"
      ],
    },
    size: {
      default: [" rounded", "p-2"],
      icon: [
        "rounded-full",
        "w-12",
        "h-12",
        "flex",
        "items-center",
        "justify-center",
        "p-2.5",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

const Button = ({variant, size, className, ...props}) => {
  return (
    <button
      {...props}
      className={twMerge(buttonStyles({variant, size}), className)}
    />
  );
}

export default Button;