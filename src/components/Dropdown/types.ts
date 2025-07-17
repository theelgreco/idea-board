import type React from "react";

export interface DropdownItem {
    label: string;
    value: string;
}

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    items: DropdownItem[];
    selectedItem?: DropdownItem["value"];
    handleSelect: (value: DropdownItem["value"]) => void;
}
