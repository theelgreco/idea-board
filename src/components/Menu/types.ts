export interface MenuItem {
    label: string;
    value: string;
    editable?: boolean;
}

export interface MenuItemProps extends React.AllHTMLAttributes<HTMLButtonElement> {
    item?: MenuItem;
    selected?: boolean;
    isNew?: boolean;
    onCreate?: (value: string) => void;
    onEdit?: (value: string) => void;
    onDelete?: () => void;
}
