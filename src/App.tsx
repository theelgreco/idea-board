import "@/App.css";
import { MdCreate } from "react-icons/md";
import Button from "@/components/Button/Button";
import IdeaBoard from "@/components/IdeaBoard/IdeaBoard";
import SideBar from "./components/SideBar/SideBar";

function App() {
    return (
        <main className="flex w-full h-full p-5! gap-5 bg-primary-background-color">
            <SideBar />
            <IdeaBoard />
            <Button Icon={MdCreate} variant="primary" className="fixed bottom-[20px] right-[20px] rounded-full aspect-square sm:hidden" />
        </main>
    );
}

export default App;
