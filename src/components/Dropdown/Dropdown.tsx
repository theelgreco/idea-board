import clsx from "clsx";
import styles from "./Dropdown.module.css";
import type { DropdownProps } from "./types";

export default function Dropdown({ id, items, selectedItem, handleSelect, ...rest }: DropdownProps) {
    return (
        <select
            className={clsx(styles.select, rest.className, "transition-colors")}
            id={id}
            value={selectedItem}
            onChange={(e) => handleSelect(e.target.value)}
        >
            {items.map((item) => (
                <option value={item.value} key={item.value}>
                    {item.label}
                </option>
            ))}
        </select>
    );
}
