import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  yolk: "bg-yolk text-ink",
  ink: "bg-ink text-yolk",
  "outline-ink": "border-[3px] border-ink text-ink",
  "outline-paper": "border-[3px] border-paper text-paper",
} as const;

const sizes = {
  md: "min-h-12 px-7 text-[20px]",
  lg: "min-h-14 px-8 text-[22px]",
  xl: "min-h-16 px-10 text-[26px]",
  sm: "min-h-[52px] px-[26px] text-[20px]",
} as const;

type ButtonProps = {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Sombra dura tipo sticker en blanco. */
  shadow?: boolean;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "yolk",
  size = "md",
  shadow = false,
  arrow = false,
  className = "",
  children,
}: ButtonProps) {
  const external = href.startsWith("http");
  const interna = href.startsWith("/") && !href.startsWith("/#");
  const Tag = interna ? Link : "a";
  return (
    <Tag
      href={href}
      {...(external && { target: "_blank", rel: "noopener" })}
      className={`btn-lift font-display inline-flex items-center justify-center gap-2.5 rounded-full no-underline ${variants[variant]} ${sizes[size]} ${shadow ? "shadow-sticker-paper" : ""} ${className}`}
    >
      {children}
      {arrow && (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </Tag>
  );
}
