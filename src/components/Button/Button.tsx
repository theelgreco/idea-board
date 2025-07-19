import clsx from "clsx";
import type { ButtonProps } from "./types";

export default function Button({ Icon, iconProps, text, iconPosition, variant, ...rest }: ButtonProps) {
    const classNames: Record<ButtonProps["variant"], string> = {
        primary:
            "bg-stone-700 border border-stone-400 hover:bg-stone-600 focus-visible:bg-stone-600 active:bg-stone-500 active:outline outline-stone-300",
        secondary:
            "border border-stone-600 hover:bg-stone-900 focus-visible:bg-stone-900 active:bg-stone-950 active:outline outline-stone-400",
        plain: "hover:bg-stone-900 focus-visible:bg-stone-900 active:bg-stone-950 active:outline outline-stone-400",
    } as const;

    return (
        <button
            {...rest}
            className={clsx(
                "flex items-center gap-3 px-5! py-3! cursor-pointer transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-sm! rounded-lg",
                classNames[variant],
                rest.className
            )}
        >
            {Icon && (iconPosition === "left" || iconPosition === undefined) ? <Icon {...iconProps} /> : <></>}
            {text && <span>{text}</span>}
            {Icon && iconPosition === "right" ? <Icon {...iconProps} /> : <></>}
        </button>
    );
}
