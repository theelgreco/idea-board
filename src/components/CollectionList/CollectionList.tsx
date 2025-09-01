import { deleteCollection, getCollections, patchCollection, postCollection, type Collection as CollectionType } from "@/api/collections";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Collection from "../Collection/Collection";
import { getErrorMessage } from "@/utils/errors";

interface CollectionListProps {
    selectedCollection: CollectionType | null;
    isAddingCollection: boolean;
    setSelectedCollection: React.Dispatch<React.SetStateAction<CollectionType | null>>;
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
    const [collections, setCollections] = useState<CollectionType[] | null>(null);

    async function createCollection(name: string) {
        try {
            const response = await postCollection({ name });
            setCollections(collections ? [...collections, response.data] : [response.data]);
            setSelectedCollection(response.data);
        } catch (err: unknown) {
            toast.error(getErrorMessage(err));
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
                setCollections(collections.filter((collection) => collection.id !== id));
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
                {/* Default "All Ideas" collection */}
                <Collection
                    collection={{ id: "all", name: "All Ideas", createdAt: "" }}
                    isEditable={false}
                    selected={!selectedCollection}
                    onClick={() => setSelectedCollection(null)}
                />
                {collections &&
                    collections.map((collection) => {
                        return (
                            <Collection
                                key={collection.id}
                                collection={collection}
                                selected={selectedCollection?.id === collection.id}
                                onClick={() => setSelectedCollection(collection)}
                                onEdit={(name) => updateCollection(name, collection.id)}
                                onDelete={() => removeCollection(collection.id)}
                            />
                        );
                    })}
                {/* New (blank) collection */}
                {isAddingCollection && <Collection isNew={true} onCreate={(name) => handleOnCreate(name)} />}
            </div>
        </div>
    );
}
