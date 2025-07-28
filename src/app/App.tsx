import "./App.css";
import IdeaBoard from "@/components/IdeaBoard/IdeaBoard";
import SideBar from "../components/SideBar/SideBar";
import { useEffect, useState } from "react";
import { type Collection, deleteCollection, getCollections, patchCollection, postCollection } from "@/api/collections";

function App() {
    const [collections, setCollections] = useState<Collection[] | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [isAddingCollection, setIsAddingCollection] = useState(false);
    const [isSubmittingCollection, setIsSubmittingCollection] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const menuItems = [
        { label: "All Ideas", value: "all", editable: false },
        ...(collections || []).map((el) => ({
            label: el.name,
            value: el.id,
            editable: true,
        })),
    ];

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
            setSelectedCollection(response.data);
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
                if (selectedCollection && selectedCollection.id === id) {
                    setSelectedCollection(null);
                }
            }
        } catch (err: unknown) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchCollections();
    }, []);

    return (
        <main className="flex w-full h-full sm:p-5! gap-5 bg-primary-background-color">
            <SideBar
                menuItems={menuItems}
                selectedCollection={selectedCollection}
                isAddingCollection={isAddingCollection}
                isSubmittingCollection={isSubmittingCollection}
                isOpen={isSideBarOpen}
                onSelectCollection={(value) => setSelectedCollection(collections?.find((el) => el.id === value) || null)}
                onCreateCollection={handleOnCreate}
                onEditCollection={updateCollection}
                onDeleteCollection={removeCollection}
                onClickAddCollection={() => setIsAddingCollection(true)}
                onCloseSideBar={() => setIsSideBarOpen(false)}
            />
            <IdeaBoard selectedCollection={selectedCollection} onOpenSideBar={() => setIsSideBarOpen(true)} />
        </main>
    );
}

export default App;
