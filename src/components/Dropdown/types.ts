import type React from "react";

export interface MenuItem<L = string, V = string> {
    label: L;
    value: V;
}

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    items: MenuItem[];
    selectedItem: MenuItem;
    handleSelect: (value: string) => void;
}
