import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button/Button";
import { type Collection, deleteCollection, getCollections, patchCollection, postCollection } from "@/api/collections";
import { MdAdd } from "react-icons/md";
import Menu from "@/components/Menu/Menu";
import type { MenuItem } from "@/components/Menu/types";

interface Props {
    selectedMenuItem: MenuItem["value"] | undefined;
    setSelectedMenuItem: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function SideBar({ selectedMenuItem, setSelectedMenuItem }: Props) {
    const [collections, setCollections] = useState<Collection[] | null>(null);
    const menuItems = useMemo<MenuItem[]>(() => {
        const items: MenuItem[] = [{ label: "All Ideas", value: "all", editable: false }];

        if (collections) {
            items.push(
                ...collections.map((el) => {
                    return { label: el.name, value: el.id, editable: true };
                })
            );
        }

        return items;
    }, [collections]);
    const [isAddingCollection, setIsAddingCollection] = useState(false);
    const [isSubmittingCollection, setIsSubmittingCollection] = useState(false);

    async function fetchCollections() {
        try {
            const response = await getCollections();
            setCollections(response.data);
        } catch (err: unknown) {
            // TO-DO: handle this properly
            console.error(err);
        }
    }

    async function createCollection(name: string) {
        try {
            const response = await postCollection({ name });
            setCollections((prev) => {
                if (prev) {
                    return [...prev, response.data];
                }
                return [response.data];
            });
            setSelectedMenuItem(response.data.id);
        } catch (err: unknown) {
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

    async function updateCollection(value: string, id: string) {
        try {
            const response = await patchCollection({ name: value }, { id });

            if (collections) {
                setCollections([...collections.filter((el) => el.id !== id), response.data]);
            }
        } catch (err: unknown) {
            console.error(err);
        }
    }

    async function removeCollection(id: string) {
        try {
            await deleteCollection({ id });
            if (collections) {
                setCollections(collections.filter((el) => el.id !== id));
                if (selectedMenuItem === id) {
                    setSelectedMenuItem(menuItems[0].value);
                }
            }
        } catch (err: unknown) {
            console.error(err);
        }
    }

    function handleClick() {
        if (!isAddingCollection) {
            setIsAddingCollection(true);
        }
    }

    useEffect(() => {
        fetchCollections();
    });

    useEffect(() => {
        if (menuItems.length && !selectedMenuItem) {
            setSelectedMenuItem(menuItems[0].value);
        }
    }, [menuItems]);

    return (
        <>
            <div className="flex flex-col justify-between sm:gap-3 sm:w-[400px] max-sm:w-0 max-sm:overflow-hidden h-full">
                <div className="max-h-full overflow-y-auto p-1">
                    <Menu
                        items={menuItems}
                        selectedItem={selectedMenuItem}
                        isAdding={isAddingCollection}
                        onCreate={handleOnCreate}
                        onSelect={(val) => setSelectedMenuItem(val.value)}
                        onEdit={(item, name) => updateCollection(name, item.value)}
                        onDelete={({ value }) => removeCollection(value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <hr className="border-stone-700" />
                    <Button
                        onClick={handleClick}
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
