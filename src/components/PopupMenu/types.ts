import { type IconBaseProps, type IconType } from "react-icons";

export interface PopupMenuItem<L = string, V = string> {
    label: L;
    value: V;
}

export interface PopupMenuProps extends React.AllHTMLAttributes<HTMLDivElement> {
    items: PopupMenuItem[];
    selectedItem: PopupMenuItem;
    Icon?: IconType;
    iconProps?: IconBaseProps;
    iconPosition?: "left" | "right";
    onSelection: (value: string) => void;
}
