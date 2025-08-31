export interface MenuProps {
    items: MenuItem[];
    selectedItem?: MenuItem["value"];
    isAdding?: boolean;
    onSelect: (item: MenuItem) => void;
    onCreate?: (name: string) => void;
    onEdit?: (item: MenuItem, name: string) => void;
    onDelete?: (item: MenuItem) => void;
}

export interface MenuItem {
    label: string;
    value: string;
    editable?: boolean;
}

export interface MenuItemProps extends React.AllHTMLAttributes<HTMLButtonElement> {
    item?: MenuItem;
    selected?: boolean;
    isAdding?: boolean;
    onCreate?: (value: string) => void;
    onEdit?: (item: MenuItem, value: string) => void;
    onDelete?: (item: MenuItem) => void;
}
