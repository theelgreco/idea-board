import styles from "./Dropdown.module.css";
import buttonStyles from "@/components/Button/Button.module.css";
import clsx from "clsx";
import type { DropdownProps } from "./types";

export default function Dropdown({ id, items, selectedItem, handleSelect, ...rest }: DropdownProps) {
    return (
        <div className="flex items-center">
            <select
                className={clsx(styles.select, buttonStyles.button, buttonStyles.plain, rest.className)}
                id={id}
                value={selectedItem.value}
                onChange={(e) => handleSelect(e.target.value)}
            >
                {items.map((item) => (
                    <option value={item.value} key={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
