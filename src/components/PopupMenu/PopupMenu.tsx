import clsx from "clsx";
import styles from "./PopupMenu.module.css";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import type { PopupMenuProps } from "./types";

export default function PopupMenu({ items, selectedItem, Icon, iconPosition, iconProps, onSelection, ...rest }: PopupMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    function togglePopupMenu() {
        setIsOpen(!isOpen);
    }

    function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    useEffect(() => {
        document.addEventListener("click", () => setIsOpen(false));

        return () => {
            document.removeEventListener("click", () => setIsOpen(false));
        };
    });

    return (
        <div {...rest} className={clsx(styles.container, rest.className)} onClick={handleContainerClick}>
            <Button
                Icon={Icon}
                iconPosition={iconPosition}
                iconProps={iconProps}
                text={selectedItem?.label}
                variant="plain"
                className="p-2!"
                onClick={togglePopupMenu}
            />
            <div className={clsx(styles["popup-menu"], { [styles.open]: isOpen })}>
                {items.map((item) => (
                    <Button
                        variant="plain"
                        key={item.value}
                        className={clsx(styles["popup-menu-item"], { [styles.selected]: item.value === selectedItem?.value })}
                        onClick={() => {
                            setIsOpen(false);
                            onSelection(item.value);
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
