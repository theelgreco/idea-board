import { deleteCollection, getCollections, patchCollection, postCollection, type Collection } from "@/api/collections";
import { UniqueConstraintError } from "@/utils/errors";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MenuItem from "../Menu/MenuItem";

interface CollectionListProps {
    selectedCollection: Collection | null;
    isAddingCollection: boolean;
    setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
    setIsSubmittingCollection: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAddingCollection: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CollectionList({
    selectedCollection,
    isAddingCollection,
    setSelectedCollection,
    setIsSubmittingCollection,
    setIsAddingCollection,
}: CollectionListProps) {
    const [collections, setCollections] = useState<Collection[] | null>(null);

    const menuItems = [
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
        <div className="flex flex-col gap-2 max-h-full overflow-y-auto p-1">
            <div className="flex flex-col gap-2">
                <MenuItem
                    item={{ label: "All Ideas", value: "all", editable: false }}
                    selected={!selectedCollection}
                    onClick={() => setSelectedCollection(null)}
                />
                {menuItems?.map((menuItem) => {
                    return (
                        <MenuItem
                            key={menuItem.value}
                            item={menuItem}
                            selected={selectedCollection?.id === menuItem.value}
                            onClick={() =>
                                setSelectedCollection(collections?.find((collection) => collection.id === menuItem.value) || null)
                            }
                            onEdit={(name) => updateCollection(name, menuItem.value)}
                            onDelete={() => removeCollection(menuItem.value)}
                        />
                    );
                })}
                {isAddingCollection && <MenuItem isNew={true} onCreate={(name) => handleOnCreate(name)} />}
            </div>
        </div>
    );
}
