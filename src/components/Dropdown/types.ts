import type React from "react";

export interface MenuItem {
    label: string;
    value: string;
}

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    items: MenuItem[];
    selectedItem?: MenuItem["value"];
    handleSelect: (value: MenuItem["value"]) => void;
}
