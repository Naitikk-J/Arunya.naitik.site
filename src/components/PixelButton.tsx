import { ReactNode, ButtonHTMLAttributes } from "react";
import { useKidcoreSounds } from "./ui/SoundEffects";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: {
    bg: "bg-radical-red",
    shadow: "shadow-[4px_4px_0_0_hsl(var(--crt-black))]",
    hover: "hover:shadow-[6px_6px_0_0_hsl(var(--crt-black))]",
    glow: "hover:drop-shadow-[0_0_10px_hsl(var(--radical-red))]",
  },
  secondary: {
    bg: "bg-cyber-blue",
    shadow: "shadow-[4px_4px_0_0_hsl(var(--crt-black))]",
    hover: "hover:shadow-[6px_6px_0_0_hsl(var(--crt-black))]",
    glow: "hover:drop-shadow-[0_0_10px_hsl(var(--cyber-blue))]",
  },
  success: {
    bg: "bg-lime-green",
    shadow: "shadow-[4px_4px_0_0_hsl(var(--crt-black))]",
    hover: "hover:shadow-[6px_6px_0_0_hsl(var(--crt-black))]",
    glow: "hover:drop-shadow-[0_0_10px_hsl(var(--lime-green))]",
  },
  warning: {
    bg: "bg-electric-yellow",
    shadow: "shadow-[4px_4px_0_0_hsl(var(--crt-black))]",
    hover: "hover:shadow-[6px_6px_0_0_hsl(var(--crt-black))]",
    glow: "hover:drop-shadow-[0_0_10px_hsl(var(--electric-yellow))]",
  },
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-[8px]",
  md: "px-6 py-3 text-[10px]",
  lg: "px-8 py-4 text-xs",
};

const PixelButton = ({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  onClick,
  ...props 
}: PixelButtonProps) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const { playSound } = useKidcoreSounds();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound('buttonPress');
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`
        font-pixel uppercase tracking-wider
        ${v.bg} ${v.shadow} ${v.hover} ${v.glow}
        border-4 border-crt-black
        text-foreground
        transition-all duration-100
        hover:translate-x-[-2px] hover:translate-y-[-2px]
        active:translate-x-[2px] active:translate-y-[2px]
        active:shadow-[2px_2px_0_0_hsl(var(--crt-black))]
        ${s}
        ${className}
      `}
      style={{ imageRendering: 'pixelated' }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default PixelButton;
