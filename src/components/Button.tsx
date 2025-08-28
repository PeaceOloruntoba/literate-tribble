import type { FC, ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  type = "button",
  ...props
}) => {
  return (
    <button className={className} type={type} {...props}>
      {children}
    </button>
  );
};

export default Button;
