import { MdAddCircle, MdCreate } from "react-icons/md";
import Button from "../Button/Button";

export default function NewIdeaButton({ ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <>
            {/* "New Idea" Button - Widescreen */}
            <Button
                variant="plain"
                className="flex flex-col justify-center w-[var(--idea-card-size)] max-w-[var(--idea-card-size)] h-[var(--idea-card-size)] max-h-[var(--idea-card-size)]  text-stone-500 text-xl! border border-dashed focus:outline outline-white max-sm:hidden!"
                Icon={MdAddCircle}
                iconProps={{ size: 80, className: "text-stone-600" }}
                text="New Idea"
                {...props}
            />
            {/* "New Idea" Button - Mobile */}
            <Button
                Icon={MdCreate}
                variant="primary"
                className="fixed bottom-[20px] right-[20px] rounded-full aspect-square sm:hidden!"
                {...props}
            />
        </>
    );
}
