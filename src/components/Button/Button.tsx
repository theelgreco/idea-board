import clsx from "clsx";
import type { ButtonProps } from "./types";
import styles from "./Button.module.css";

export default function Button({ Icon, iconProps, text, iconPosition, variant, children, ...rest }: ButtonProps) {
    return (
        <button {...rest} className={clsx(styles.button, styles[variant], rest.className)}>
            {Icon && (iconPosition === "left" || iconPosition === undefined) && <Icon {...iconProps} />}
            {text && <span>{text}</span>}
            {children}
            {Icon && iconPosition === "right" && <Icon {...iconProps} />}
        </button>
    );
}
