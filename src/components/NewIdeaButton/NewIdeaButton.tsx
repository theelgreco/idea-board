import { MdAddCircle, MdCreate } from "react-icons/md";
import Button from "../Button/Button";

interface NewIdeaButtonProps {
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewIdeaButton({ setIsAdding }: NewIdeaButtonProps) {
    return (
        <>
            {/* "New Idea" Button - Widescreen */}
            <Button
                variant="plain"
                className="flex flex-col justify-center w-[var(--idea-card-size)] max-w-[var(--idea-card-size)] h-[var(--idea-card-size)] max-h-[var(--idea-card-size)]  text-stone-500 text-xl! border border-dashed focus:outline outline-white max-sm:hidden!"
                onClick={() => setIsAdding(true)}
                Icon={MdAddCircle}
                iconProps={{ size: 80, className: "text-stone-600" }}
                text="New Idea"
            />
            {/* "New Idea" Button - Mobile */}
            <Button
                Icon={MdCreate}
                variant="primary"
                className="fixed bottom-[20px] right-[20px] rounded-full aspect-square sm:hidden!"
                onClick={() => setIsAdding(true)}
            />
        </>
    );
}
