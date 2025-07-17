import { useEffect, useRef, useState } from "react";
import "./App.css";
import { fetchCollections, type Collection } from "./api/collections";
import Dropdown from "./components/Dropdown/Dropdown";
import type { DropdownItem } from "./components/Dropdown/types";
import Button from "./components/Button/Button";
import { MdAdd } from "react-icons/md";

function App() {
    const [collections, setCollections] = useState<Collection[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);
    const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([{ label: "All Ideas", value: "all" }]);
    const [selectedDropdownItem, setSelectedDropdownItem] = useState<DropdownItem["value"]>(dropdownItems[0].value);
    const addCollectionDialog = useRef<HTMLDialogElement>(null);

    console.log(error);
    console.log(collections);

    function toggleCollectionDialog() {
        if (addCollectionDialog.current) {
            return addCollectionDialog.current.hasAttribute("open")
                ? addCollectionDialog.current.close()
                : addCollectionDialog.current.showModal();
        }
    }

    const getCollections = async () => {
        try {
            const response = await fetchCollections();
            setCollections(response.data);
            setDropdownItems((prev) => [
                ...prev,
                ...response.data.map((el) => {
                    return { label: el.name, value: el.name };
                }),
            ]);
        } catch (err: unknown) {
            setError(err);
        } finally {
            setIsLoading(false);
            setError("djisfdi");
        }
    };

    // const addNewCollection = async () => {};

    useEffect(() => {
        getCollections();
    }, []);

    useEffect(() => {
        addCollectionDialog.current?.setAttribute("closedby", "any");
    }, [addCollectionDialog]);

    if (isLoading) return <p>Loading...</p>;

    return (
        <main className="flex flex-col w-full h-full p-5! sm:p-10!">
            <div className="flex gap-3">
                <Dropdown
                    id="collection-dropdown"
                    className="flex-grow"
                    items={dropdownItems}
                    handleSelect={(val) => setSelectedDropdownItem(val)}
                    selectedItem={selectedDropdownItem}
                />
                <Button onClick={toggleCollectionDialog} Icon={MdAdd} variant="secondary" />
                <dialog ref={addCollectionDialog} className="gap-10">
                    <div>
                        <h1 className="text-2xl">Add a new collection</h1>
                        <h2 className="text-stone-400 mb-3!">Enter the name of the new collection</h2>
                        <small>* indicates a required field</small>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="new-collection-name" className="w-fit">
                            <small className="select-none">* Collection Name</small>
                        </label>
                        <input type="text" id="new-collection-name" autoFocus required />
                    </div>
                    <div className="flex justify-between">
                        <Button onClick={toggleCollectionDialog} text="Cancel" variant="secondary" />
                        <Button text="Save" variant="primary" />
                    </div>
                </dialog>
            </div>
        </main>
    );
}

export default App;
