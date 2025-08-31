import clsx from "clsx";
import styles from "./PopupMenu.module.css";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import type { PopupMenuProps } from "./types";

export default function PopupMenu({ items, selectedItem, Icon, iconPosition, iconProps, onSelection, ...rest }: PopupMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    function closePopupMenu() {
        if (isOpen) {
            setIsOpen(false);
        }
    }

    function openPopupMenu() {
        if (!isOpen) {
            setIsOpen(true);
        }
    }

    function togglePopupMenu() {
        if (isOpen) {
            closePopupMenu();
        } else {
            openPopupMenu();
        }
    }

    function handleDocumentClick() {
        closePopupMenu();
    }

    function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
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
                {items.map((el) => (
                    <Button
                        variant="plain"
                        key={el.value}
                        className={clsx(styles["popup-menu-item"], { [styles.selected]: el.value === selectedItem?.value })}
                        onClick={() => {
                            setIsOpen(false);
                            onSelection(el.value);
                        }}
                    >
                        {el.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
