import Button from "@/components/Button/Button";
import { MdAdd } from "react-icons/md";
import Menu from "@/components/Menu/Menu";
import type { SideBarProps } from "./types";
import clsx from "clsx";

export default function SideBar({
    menuItems,
    selectedCollection,
    isAddingCollection,
    isSubmittingCollection,
    isOpen,
    onSelectCollection,
    onCreateCollection,
    onEditCollection,
    onDeleteCollection,
    onClickAddCollection,
    onCloseSideBar,
}: SideBarProps) {
    return (
        <>
            <div
                className={clsx(
                    "h-full flex flex-col justify-between sm:gap-3 sm:w-[400px] max-sm:fixed max-sm:bg-inherit max-sm:z-40 max-sm:shadow-2xl max-sm:overflow-hidden max-sm:transition-all max-sm:-translate-x-full max-sm:w-2/3 max-sm:p-3",
                    { "max-sm:translate-x-0": isOpen }
                )}
            >
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
            {isOpen && <div className="sm:hidden fixed w-full h-full bg-black/70 z-39" onClick={onCloseSideBar}></div>}
        </>
    );
}
