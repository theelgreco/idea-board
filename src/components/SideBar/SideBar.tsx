import Button from "@/components/Button/Button";
import { MdAdd } from "react-icons/md";
import Menu from "@/components/Menu/Menu";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteCollection, getCollections, patchCollection, postCollection } from "@/api/collections";
import type { Collection } from "@/api/collections";
import { UniqueConstraintError } from "@/utils/errors";

export interface SideBarProps {
    isSideBarOpen: boolean;
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCollection: Collection | null;
    setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
}

export default function SideBar({ isSideBarOpen, setIsSideBarOpen, selectedCollection, setSelectedCollection }: SideBarProps) {
    const [collections, setCollections] = useState<Collection[] | null>(null);
    const [isAddingCollection, setIsAddingCollection] = useState(false);
    const [isSubmittingCollection, setIsSubmittingCollection] = useState(false);
    const menuItems = [
        { label: "All Ideas", value: "all", editable: false },
        ...(collections || []).map((el) => ({
            label: el.name,
            value: el.id,
            editable: true,
        })),
    ];

    async function createCollection(name: string) {
        try {
            const response = await postCollection({ name });
            setCollections(collections ? [...collections, response.data] : [response.data]);
            setSelectedCollection(response.data);
        } catch (err: unknown) {
            if (err instanceof UniqueConstraintError) {
                toast.error(err.message);
            }
            console.error(err);
        }
    }

    async function handleOnCreate(name: string) {
        setIsSubmittingCollection(true);

        if (name) {
            await createCollection(name);
        }

        setIsAddingCollection(false);
        setIsSubmittingCollection(false);
    }

    async function updateCollection(name: string, id: string) {
        try {
            const response = await patchCollection({ name }, { id });

            setCollections((prevCollections) => {
                return (prevCollections || []).map((collection) => {
                    if (collection.id === id) {
                        collection.name = name;
                    }

                    return collection;
                });
            });
            setSelectedCollection(response.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
        }
    }

    async function removeCollection(id: string) {
        try {
            await deleteCollection({ id });
            if (collections) {
                setCollections(collections.filter((el) => el.id !== id));
                if (selectedCollection && selectedCollection.id === id) {
                    setSelectedCollection(null);
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
        }
    }

    useEffect(() => {
        async function fetchCollections() {
            try {
                const response = await getCollections();
                setCollections(response.data);
            } catch {
                toast.error("An error occurred while fetching collections. Try again.");
            }
        }

        fetchCollections();
    }, []);

    return (
        <>
            <div
                className={clsx(
                    "h-full flex flex-col justify-between sm:gap-3 sm:w-[400px] max-sm:fixed max-sm:bg-inherit max-sm:z-40 max-sm:overflow-hidden max-sm:transition-all max-sm:-translate-x-full max-sm:w-2/3 max-sm:p-3",
                    { "max-sm:translate-x-0": isSideBarOpen }
                )}
            >
                <div className="max-h-full overflow-y-auto p-1">
                    <Menu
                        items={menuItems}
                        selectedItem={selectedCollection ? selectedCollection.id : "all"}
                        isAdding={isAddingCollection}
                        onCreate={(name) => handleOnCreate(name)}
                        onSelect={(menuItem) => setSelectedCollection(collections?.find((el) => el.id === menuItem.value) || null)}
                        onEdit={(menuItem, name) => updateCollection(name, menuItem.value)}
                        onDelete={(menuItem) => removeCollection(menuItem.value)}
                    />
                </div>
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
            </div>
            {isSideBarOpen && (
                <div className="sm:hidden fixed w-full h-full bg-black/70 z-39" onClick={() => setIsSideBarOpen(false)}></div>
            )}
        </>
    );
}
