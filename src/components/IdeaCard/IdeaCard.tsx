import type { IdeaCardProps } from "./types";
import styles from "./IdeaCard.module.css";
import { formatRelative } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { DESCRIPTION_MAX_CHAR_COUNT } from "@/utils/constants";
import clsx from "clsx";
import throttle from "@/utils/throttle";
import { IoMdTrash } from "react-icons/io";

export default function IdeaCard({
    name,
    description,
    createdAt,
    lastModified,
    isAdding,
    onCreate,
    onSave,
    onDelete,
    onCancel,
}: IdeaCardProps) {
    const [newIdeaName, setNewIdeaName] = useState(name);
    const [newIdeaDescription, setNewIdeaDescription] = useState(description);
    const [maxCountExceeded, setMaxCountExceeded] = useState(false);
    const [editing, setEditing] = useState({ name: false, description: false });
    const [isHovered, setIsHovered] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    const createdAtString = createdAt ? formatRelative(new Date(createdAt), new Date()) : null;
    const lastModifiedString = lastModified ? formatRelative(new Date(lastModified), new Date()) : null;

    const debouncedSetMaxCountExceeded = useMemo(() => {
        return throttle(() => {
            setMaxCountExceeded((prev) => !prev);
        }, 200);
    }, []);

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (e.key === "Escape" || e.key === "Enter") {
            nameInputRef.current?.blur();
        }
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        e.stopPropagation();

        if (isAdding) {
            if (!newIdeaName) {
                onCancel?.();
            } else {
                onCreate?.({ name: newIdeaName, description: "" });
            }
        } else {
            setEditing({ name: false, description: false });

            if (newIdeaName || newIdeaDescription) {
                onSave?.({ name: newIdeaName, description: newIdeaDescription });
            }
        }
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (e.target.value.length <= DESCRIPTION_MAX_CHAR_COUNT) {
            setNewIdeaDescription(e.target.value);
        }

        if (e.target.value.length >= DESCRIPTION_MAX_CHAR_COUNT) {
            debouncedSetMaxCountExceeded();
        }
    }

    function handleMouseEnter() {
        if (!isAdding) {
            setIsHovered(true);
        }
    }

    return (
        <div className={styles["idea-card"]} onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsHovered(false)}>
            <div className={styles.header}>
                {!isAdding && !editing.name ? (
                    <>
                        <h1 onDoubleClick={() => setEditing({ name: true, description: false })}>{name}</h1>
                        <IoMdTrash size={18} className={styles.icon} onClick={onDelete} />
                    </>
                ) : (
                    <input
                        ref={nameInputRef}
                        className={styles["text-input"]}
                        type="text"
                        autoFocus
                        placeholder="Enter idea name"
                        value={newIdeaName}
                        onKeyUp={handleKeyPress}
                        onChange={(e) => setNewIdeaName(e.target.value)}
                        onBlur={handleBlur}
                    />
                )}
            </div>
            <div className={clsx(styles.description, { disabled: isAdding && !newIdeaName })}>
                {!isAdding && !editing.description ? (
                    <>
                        <p className="h-full" onDoubleClick={() => setEditing({ name: false, description: true })}>
                            {description ? <span>{description}</span> : <span className={styles["no-description"]}>What's your idea?</span>}
                        </p>
                        <small className={styles["char-count"]}>{description.length} / 140</small>
                    </>
                ) : (
                    <>
                        <textarea
                            autoFocus={editing.description}
                            ref={descriptionInputRef}
                            className={styles["text-input"]}
                            placeholder="What's your idea?"
                            value={newIdeaDescription}
                            onKeyUp={handleKeyPress}
                            onChange={handleDescriptionChange}
                            onBlur={handleBlur}
                        />
                        <small
                            className={clsx(styles["char-count"], {
                                [styles.warning]: newIdeaDescription?.length > 120,
                                [styles.danger]: newIdeaDescription?.length > 130,
                                [styles.max]: maxCountExceeded,
                            })}
                        >
                            {newIdeaDescription.length} / 140
                        </small>
                    </>
                )}
            </div>
            <div className={styles.footer}>
                <small className={styles.metadata}>{createdAtString ? `Created ${createdAtString}` : <br />}</small>
                <small className={styles.metadata}>{lastModifiedString ? `Modified ${lastModifiedString}` : <br />}</small>
            </div>
        </div>
    );
}
