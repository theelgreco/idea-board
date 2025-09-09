import clsx from "clsx";
import styles from "./Button.module.css";
import type { IconBaseProps, IconType } from "react-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    Icon?: IconType;
    iconProps?: IconBaseProps;
    iconPosition?: "left" | "right";
    variant: "primary" | "secondary" | "plain";
}

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
