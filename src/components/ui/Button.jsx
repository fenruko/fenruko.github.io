import { Link } from "react-router-dom";

const VARIANTS = {
  primary:
    "bg-[#5865f2] text-white border border-[#5865f2] " +
    "shadow-[0_0_0_1px_rgba(88,101,242,0.25),0_10px_28px_-10px_rgba(88,101,242,0.65)] " +
    "hover:bg-[#6b76ff] hover:shadow-[0_0_0_1px_rgba(88,101,242,0.45),0_12px_34px_-10px_rgba(88,101,242,0.85)]",
  secondary:
    "bg-white/[0.04] text-white/90 border border-white/10 backdrop-blur-sm " +
    "hover:bg-white/[0.09] hover:border-white/25",
  ghost: "bg-transparent text-white/55 border border-transparent hover:text-white",
};

const SIZES = {
  sm: "px-4 py-1.5 text-[13px]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-[15px]",
};

export default function Button({
  to,
  href,
  external,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium select-none " +
    "transition-all duration-200 active:scale-[0.97] " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5865f2] " +
    VARIANTS[variant] +
    " " +
    SIZES[size] +
    " " +
    className;

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
