import { MdAddCircle, MdCreate } from "react-icons/md";
import type { AddIdeaButtonProps } from "./types";
import styles from "./AddIdeaButton.module.css";
import Button from "../Button/Button";
import clsx from "clsx";

export default function AddIdeaButton({ onClick }: AddIdeaButtonProps) {
    return (
        <>
            <div data-testid="add-idea-btn" className={clsx(styles["add-idea-button"], styles.widescreen)} onClick={onClick} tabIndex={1}>
                <MdAddCircle size={80} className={styles.icon} />
                <p>New Idea</p>
            </div>
            <Button
                Icon={MdCreate}
                variant="primary"
                className={clsx("fixed bottom-[20px] right-[20px] rounded-full aspect-square", styles.mobile)}
                onClick={onClick}
            />
        </>
    );
}
