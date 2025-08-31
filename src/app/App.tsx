import "./App.css";
import IdeaBoard from "@/components/IdeaBoard/IdeaBoard";
import SideBar from "../components/SideBar/SideBar";
import { useEffect, useState } from "react";
import { type Collection } from "@/api/collections";
import { Toaster } from "@/components/ui/sonner";

function App() {
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)")) {
            document.body.classList.add("dark");
        }
    }, []);

    return (
        <>
            <div className="flex w-full h-full sm:p-5! gap-5 bg-primary-background-color">
                <SideBar
                    isSideBarOpen={isSideBarOpen}
                    setIsSideBarOpen={() => setIsSideBarOpen(false)}
                    selectedCollection={selectedCollection}
                    setSelectedCollection={setSelectedCollection}
                />
                <IdeaBoard selectedCollection={selectedCollection} setIsSideBarOpen={setIsSideBarOpen} />
            </div>
            <Toaster position="top-right" richColors />
        </>
    );
}

export default App;
