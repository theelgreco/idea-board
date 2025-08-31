import Button from "@/components/Button/Button";
import { MdAdd } from "react-icons/md";
import clsx from "clsx";
import { useState } from "react";
import type { Collection } from "@/api/collections";
import CollectionList from "../CollectionList/CollectionList";

export interface SideBarProps {
    isSideBarOpen: boolean;
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCollection: Collection | null;
    setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
}

export default function SideBar({ isSideBarOpen, setIsSideBarOpen, selectedCollection, setSelectedCollection }: SideBarProps) {
    const [isAddingCollection, setIsAddingCollection] = useState(false);
    const [isSubmittingCollection, setIsSubmittingCollection] = useState(false);

    return (
        <>
            <aside
                className={clsx(
                    "h-full flex flex-col justify-between sm:gap-3 sm:w-[400px] max-sm:fixed max-sm:bg-inherit max-sm:z-40 max-sm:overflow-hidden max-sm:transition-all max-sm:-translate-x-full max-sm:w-2/3 max-sm:p-3",
                    { "max-sm:translate-x-0": isSideBarOpen }
                )}
            >
                <CollectionList
                    selectedCollection={selectedCollection}
                    isAddingCollection={isAddingCollection}
                    setSelectedCollection={setSelectedCollection}
                    setIsSubmittingCollection={setIsSubmittingCollection}
                    setIsAddingCollection={setIsAddingCollection}
                />
                <div className="flex flex-col gap-2">
                    <hr className="border-stone-700" />
                    <Button
                        onClick={() => setIsAddingCollection(true)}
                        text="Add Collection"
                        Icon={MdAdd}
                        variant="plain"
                        iconPosition="right"
                        className="justify-between w-full"
                        disabled={isSubmittingCollection || isAddingCollection}
                    />
                </div>
            </aside>
            {/* Overlay background behind the sidebar; clicking it will close the sidebar */}
            {isSideBarOpen && (
                <div className="sm:hidden fixed w-full h-full bg-black/70 z-39" onClick={() => setIsSideBarOpen(false)}></div>
            )}
        </>
    );
}
