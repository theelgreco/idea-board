import Button from "@/components/Button/Button";
import { MdAdd } from "react-icons/md";
import Menu from "@/components/Menu/Menu";
import type { SideBarProps } from "./types";

export default function SideBar({
    menuItems,
    selectedCollection,
    isAddingCollection,
    isSubmittingCollection,
    onSelectCollection,
    onCreateCollection,
    onEditCollection,
    onDeleteCollection,
    onClickAddCollection,
}: SideBarProps) {
    return (
        <>
            <div className="flex flex-col justify-between sm:gap-3 sm:w-[400px] max-sm:hidden max-sm:overflow-hidden h-full">
                <div className="max-h-full overflow-y-auto p-1">
                    <Menu
                        items={menuItems}
                        selectedItem={selectedCollection ? selectedCollection.id : "all"}
                        isAdding={isAddingCollection}
                        onCreate={onCreateCollection}
                        onSelect={(item) => onSelectCollection(item.value)}
                        onEdit={(item, name) => onEditCollection(name, item.value)}
                        onDelete={({ value }) => onDeleteCollection(value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <hr className="border-stone-700" />
                    <Button
                        onClick={onClickAddCollection}
                        text="Add Collection"
                        Icon={MdAdd}
                        variant="plain"
                        iconPosition="right"
                        className="justify-between w-full"
                        disabled={isSubmittingCollection || isAddingCollection}
                    />
                </div>
            </div>
        </>
    );
}
