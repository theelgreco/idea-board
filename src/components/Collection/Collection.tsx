import clsx from "clsx";
import React, { useRef, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Button from "../Button/Button";
import type { Collection } from "@/api/collections";

export interface CollectionProps extends React.AllHTMLAttributes<HTMLButtonElement> {
    collection?: Collection;
    selected?: boolean;
    isNew?: boolean;
    isEditable?: boolean;
    onCreate?: (value: string) => void;
    onEdit?: (value: string) => void;
    onDelete?: () => void;
}

export default function Collection({
    collection,
    selected,
    isNew,
    isEditable = true,
    onCreate = () => {},
    onEdit = () => {},
    onDelete = () => {},
    ...rest
}: CollectionProps) {
    const [isEditing, setIsEditing] = useState(isNew);
    const [inputValue, setInputValue] = useState(collection?.name || "");
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function toggleEdit() {
        if (!isEditing && isEditable) {
            setIsEditing(true);
        }
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Escape" || e.key === "Enter") {
            inputRef.current?.blur();
        }
    }

    function handleBlur() {
        if (isNew) {
            onCreate(inputValue);
        } else if (collection && isEditable) {
            const hasChanged = inputValue && inputValue !== collection.name;

            if (hasChanged) {
                onEdit(inputValue);
            } else {
                setInputValue(collection.name);
            }
        }

        setIsEditing(false);
    }

    return (
        <Button
            variant="plain"
            className={clsx(
                "flex items-center justify-between gap-3 px-5! py-3! cursor-pointer transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-900 focus-visible:bg-stone-900 rounded-lg! text-sm!",
                { "bg-stone-900 sticky top-0 bottom-0": selected, "outline! outline-white! bg-stone-900/50!": isEditing }
            )}
            onDoubleClick={toggleEdit}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            {...rest}
            type="button"
        >
            {isEditing && (isEditable || isNew) ? (
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter Collection Name"
                    className={clsx({ "outline-0! w-full": isEditing })}
                    onBlur={handleBlur}
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
            ) : (
                <>
                    <span className="w-full text-left">{collection?.name}</span>
                    {/* Only shows edit/delete buttons when the collection is hovered or currently selected */}
                    {(isHovered || selected) && isEditable && (
                        <>
                            <MdEdit
                                tabIndex={0}
                                className="hover:bg-stone-700/50 mr-3"
                                onClick={toggleEdit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        toggleEdit();
                                    }
                                }}
                            />
                            <MdDelete
                                tabIndex={0}
                                className="hover:bg-stone-700/50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onDelete();
                                    }
                                }}
                            />
                        </>
                    )}
                </>
            )}
        </Button>
    );
}
