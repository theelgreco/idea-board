import "./App.css";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { fetchCollections, postCollection, type Collection } from "./api/collections";
import { MdAdd } from "react-icons/md";
import { FieldError } from "@/utils/errors";
import type { DropdownItem } from "./components/Dropdown/types";
import clsx from "clsx";
import Dropdown from "./components/Dropdown/Dropdown";
import Button from "./components/Button/Button";

function App() {
    const [collections, setCollections] = useState<Collection[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const dropdownItems = useMemo<DropdownItem[]>(() => {
        const items = [{ label: "All Collections", value: "all" }];

        if (collections) {
            items.push(
                ...collections.map((el) => {
                    return { label: el.name, value: el.name };
                })
            );
        }

        return items;
    }, [collections]);
    const [selectedDropdownItem, setSelectedDropdownItem] = useState<DropdownItem["value"] | undefined>(undefined);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const addCollectionDialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        getCollections();
    }, []);

    useEffect(() => {
        if (addCollectionDialog.current) {
            addCollectionDialog.current.setAttribute("closedby", "any");
        }
    }, [addCollectionDialog]);

    useEffect(() => {
        if (dropdownItems.length && !selectedDropdownItem) {
            setSelectedDropdownItem(dropdownItems[0].value);
        }
    }, [dropdownItems]);

    async function getCollections() {
        try {
            const response = await fetchCollections();
            setCollections(response.data);
        } catch (err: unknown) {
            // TO-DO: handle this properly
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await postCollection({ name: newCollectionName });
            setCollections((prev) => {
                if (prev) {
                    return [...prev, response.data];
                }
                return [response.data];
            });
            toggleAddCollectionDialog();
        } catch (err: unknown) {
            if (err instanceof FieldError) {
                setFormErrors((prev) => {
                    return { ...prev, ...Object.fromEntries(err.fields.map((el) => [el, err.message])) };
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    function toggleAddCollectionDialog() {
        if (!addCollectionDialog.current) return;

        if (addCollectionDialog.current.hasAttribute("open")) {
            addCollectionDialog.current.close();
        } else {
            addCollectionDialog.current.showModal();
        }
    }

    function handleDialogClose() {
        setNewCollectionName("");
        setFormErrors({});
    }

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
                <Button onClick={toggleAddCollectionDialog} Icon={MdAdd} variant="secondary" className="sm:hidden!" />
                <Button
                    onClick={toggleAddCollectionDialog}
                    text="Add Collection"
                    Icon={MdAdd}
                    variant="secondary"
                    className="max-sm:hidden"
                />
                <dialog ref={addCollectionDialog} className="gap-10" onClose={handleDialogClose}>
                    <div>
                        <h1 className="text-2xl">Add a new collection</h1>
                        <h2 className="text-stone-400 mb-3!">Enter the name of the new collection</h2>
                        <small>* indicates a required field</small>
                    </div>
                    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="new-collection-name" className="w-fit">
                                <small className="select-none">* Collection Name</small>
                            </label>
                            <input
                                type="text"
                                id="new-collection-name"
                                autoFocus
                                value={newCollectionName}
                                disabled={isLoading}
                                className={clsx({
                                    error: formErrors.name,
                                })}
                                onChange={(e) => {
                                    setNewCollectionName(e.target.value);
                                    setFormErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.name;
                                        return newErrors;
                                    });
                                }}
                            />
                            {formErrors.name && <small className="text-red-500">{formErrors.name}</small>}
                        </div>
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                onClick={toggleAddCollectionDialog}
                                text="Cancel"
                                variant="secondary"
                                disabled={isLoading}
                            />
                            <Button type="submit" text="Save" variant="primary" disabled={isLoading} />
                        </div>
                    </form>
                </dialog>
            </div>
        </main>
    );
}

export default App;
