import type React from "react";

export interface Collection<L = string, V = string> {
    label: L;
    value: V;
}

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    items: Collection[];
    selectedItem: Collection;
    handleSelect: (value: string) => void;
}
