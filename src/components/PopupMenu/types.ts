import { type IconBaseProps, type IconType } from "react-icons";

export interface PopupCollection<L = string, V = string> {
    label: L;
    value: V;
}

export interface PopupMenuProps extends React.AllHTMLAttributes<HTMLDivElement> {
    items: PopupCollection[];
    selectedItem: PopupCollection;
    Icon?: IconType;
    iconProps?: IconBaseProps;
    iconPosition?: "left" | "right";
    onSelection: (value: string) => void;
}
