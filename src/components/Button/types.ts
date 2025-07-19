import type React from "react";
import type { IconBaseProps, IconType } from "react-icons";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    Icon?: IconType;
    iconProps?: IconBaseProps;
    iconPosition?: "left" | "right";
    variant: "primary" | "secondary" | "plain";
}
