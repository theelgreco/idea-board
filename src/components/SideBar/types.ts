import type { Collection } from "@/api/collections";
import type { MenuItem } from "../Menu/types";

export interface SideBarProps {
    menuItems: MenuItem[];
    selectedCollection: Collection | null;
    isAddingCollection: boolean;
    isSubmittingCollection: boolean;
    isOpen: boolean;
    onSelectCollection: React.Dispatch<React.SetStateAction<string | undefined>>;
    onCreateCollection: (name: string) => void;
    onEditCollection: (newName: string, id: string) => void;
    onDeleteCollection: (id: string) => void;
    onClickAddCollection: () => void;
    onCloseSideBar: () => void;
}
