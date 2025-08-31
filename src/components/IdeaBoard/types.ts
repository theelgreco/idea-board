import type { Collection } from "@/api/collections";
import type { PopupCollection } from "../PopupMenu/types";

export interface IdeaBoardProps {
    selectedCollection: Collection | null;
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type OrderChoices = "asc" | "desc";

export type SortByOptions = "createdAt" | "name";

export type SortByCollection = PopupCollection<string, SortByOptions>;
