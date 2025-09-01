import styles from "./IdeaCard.module.css";
import { formatRelative } from "date-fns";
import { useRef, useState } from "react";
import { DESCRIPTION_MAX_CHAR_COUNT } from "@/utils/constants";
import clsx from "clsx";
import throttle from "@/utils/throttle";
import { IoMdTrash } from "react-icons/io";
import Button from "../Button/Button";
import type { Idea } from "@/api/ideas";

export interface IdeaCardSaveArgs {
    name?: string;
    description?: string;
}

export interface IdeaCardProps extends React.AllHTMLAttributes<HTMLDivElement> {
    idea?: Idea;
    isNew?: boolean;
    autoFocusDescription?: boolean;
    onSave: (data: IdeaCardSaveArgs) => void;
    onDelete?: () => void;
}

export default function IdeaCard({ idea, isNew, autoFocusDescription, onSave, onDelete = () => {} }: IdeaCardProps) {
    const [newIdeaName, setNewIdeaName] = useState(idea?.name || "");
    const [newIdeaDescription, setNewIdeaDescription] = useState(idea?.description || "");
    const [maxCountExceeded, setMaxCountExceeded] = useState(false);

    const nameInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

    const createdAtString = idea?.createdAt ? formatRelative(new Date(idea.createdAt), new Date()) : null;
    const lastModifiedString = idea?.lastModified ? formatRelative(new Date(idea.lastModified), new Date()) : null;

    const throttledSetMaxCountExceeded = throttle(() => {
        setMaxCountExceeded((previousValue) => !previousValue);
    }, 200);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const isValidKeyCombination = e.key === "Enter" || e.key === "Escape" || (e.shiftKey && e.key === "Enter");

        if (isValidKeyCombination) {
            const element = e.target as HTMLInputElement | HTMLTextAreaElement;
            element.blur();
        }
    }

    function handleSave() {
        const postData: IdeaCardSaveArgs = { name: undefined, description: undefined };

        // Reset back to original values if either name or description is blank
        if (!newIdeaName && idea) setNewIdeaName(idea?.name || "");
        if (!newIdeaDescription && idea) setNewIdeaDescription(idea?.description || "");

        if (newIdeaName !== idea?.name) {
            postData.name = newIdeaName;
        } else if (newIdeaDescription !== idea?.description) {
            postData.description = newIdeaDescription;
        }

        onSave(postData);
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (e.target.value.length <= DESCRIPTION_MAX_CHAR_COUNT) {
            setNewIdeaDescription(e.target.value);
        }

        // If the user is typing when the description is max length, the char count does a shake animation.
        if (e.target.value.length >= DESCRIPTION_MAX_CHAR_COUNT) {
            throttledSetMaxCountExceeded();
        }
    }

    return (
        <article className={styles["idea-card"]}>
            <header className={styles.header}>
                <input
                    ref={nameInputRef}
                    className={clsx(styles["text-input"], "p-1! mr-2!")}
                    type="text"
                    autoFocus={isNew} // Only autofocus if there is no name, i.e when first adding.
                    placeholder="Enter idea name"
                    value={newIdeaName}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNewIdeaName(e.target.value)}
                    onBlur={handleSave}
                />
                {!isNew && (
                    <Button variant="plain" className="px-2!" onClick={onDelete}>
                        <IoMdTrash size={18} className={styles.icon} />
                    </Button>
                )}
            </header>
            <div className={clsx(styles.description)}>
                <textarea
                    ref={descriptionInputRef}
                    className={clsx(styles["text-input"], "p-1!")}
                    placeholder="What's your idea?"
                    value={newIdeaDescription}
                    autoFocus={autoFocusDescription}
                    onKeyDown={handleKeyDown}
                    onChange={handleDescriptionChange}
                    onBlur={handleSave}
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
            </div>
            <footer className={styles.footer}>
                <small className={styles.metadata}>{createdAtString ? `Created ${createdAtString}` : <br />}</small>
                <small className={styles.metadata}>{lastModifiedString ? `Modified ${lastModifiedString}` : <br />}</small>
            </footer>
        </article>
    );
}
