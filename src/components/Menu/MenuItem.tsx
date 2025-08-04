import clsx from "clsx";
import type { MenuItemProps } from "./types";
import React, { useEffect, useRef, useState } from "react";
import styles from "./MenuItem.module.css";
import { MdDelete, MdEdit } from "react-icons/md";

export default function MenuItem({ item, selected, isAdding, onCreate, onEdit, onDelete, ...rest }: MenuItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(item?.label || "");
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function toggleEdit(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (!isEditing && item?.editable) {
            setIsEditing(true);
        }
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Escape" || e.key === "Enter") {
            inputRef.current?.blur();
        }
    }

    function handleBlur() {
        // New item
        if (isAdding) {
            onCreate?.(inputValue);
        }

        // Existing item
        if (item) {
            // Has changed
            if (inputValue && inputValue !== item.label) {
                onEdit?.(item, inputValue);
            } else {
                setInputValue(item.label);
            }

            setIsEditing(false);
        }
    }

    useEffect(() => {
        if (isAdding) {
            setIsEditing(true);
        }
    }, [isAdding]);

    return (
        <div
            className={clsx(
                "flex items-center justify-between gap-3 px-5! py-3! cursor-pointer transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-900 focus-visible:bg-stone-900 rounded-lg! text-sm!",
                styles["menu-item"],
                { "bg-stone-900 sticky top-0 bottom-0": selected }
            )}
            onDoubleClick={toggleEdit}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            {...rest}
        >
            {isEditing && (item?.editable || isAdding) ? (
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter Collection Name"
                    className={clsx({ [styles.editing]: isEditing })}
                    onBlur={handleBlur}
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyUp={handleKeyPress}
                />
            ) : (
                <>
                    <span>{item?.label}</span>
                    {(isHovered || selected) && item?.editable && (
                        <div className="flex gap-2">
                            <MdEdit className="hover:bg-stone-700/50 mr-3" onClick={toggleEdit} />
                            <MdDelete
                                className="hover:bg-stone-700/50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(item);
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
