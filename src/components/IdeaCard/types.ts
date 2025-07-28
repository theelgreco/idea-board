import type { IdeaPostData, IdeaPutData } from "@/api/ideas";

export interface IdeaCardProps extends React.AllHTMLAttributes<HTMLDivElement> {
    name: string;
    description: string;
    createdAt?: string;
    lastModified?: string;
    isAdding?: boolean;
    onCreate?: (data: IdeaPostData) => void;
    onSave?: (data: IdeaPutData) => void;
    onDelete?: () => void;
    onCancel?: () => void;
}
