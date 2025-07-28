import type { Collection } from "@/api/collections";
import type { PopupMenuItem } from "../PopupMenu/types";

export interface IdeaBoardProps {
    selectedCollection: Collection | null;
}

export type OrderChoices = "asc" | "desc";

export type SortByOptions = "createdAt" | "name";

export type SortByMenuItem = PopupMenuItem<string, SortByOptions>;
