import type { Idea } from "@/api/ideas";

export interface IdeaCardSaveArgs {
    name?: string;
    description?: string;
}

export interface IdeaCardProps extends React.AllHTMLAttributes<HTMLDivElement> {
    idea?: Idea;
    isNew?: boolean;
    onSave: (data: IdeaCardSaveArgs) => void;
    onDelete: () => void;
}
