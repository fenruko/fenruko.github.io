import { Link } from "react-router-dom";

const VARIANTS = {
  primary:
    "text-white border border-[#7aa2f7]/30 " +
    "bg-[linear-gradient(135deg,#4663d8,#1b2a60)] " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_30px_-10px_rgba(70,99,216,0.7)] " +
    "hover:bg-[linear-gradient(135deg,#5877ee,#223476)] hover:border-[#7aa2f7]/55 " +
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_14px_36px_-10px_rgba(70,99,216,0.9)]",
  secondary:
    "text-white/90 border border-white/10 backdrop-blur-md " +
    "bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] " +
    "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.04))] hover:border-white/25",
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
    "transition-all duration-300 ease-[cubic-bezier(0.22,0.8,0.32,1)] active:scale-[0.97] " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7aa2f7] " +
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
