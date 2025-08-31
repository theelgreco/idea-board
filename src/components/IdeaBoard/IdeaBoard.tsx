import { useEffect, useState } from "react";
import IdeaCard from "../IdeaCard/IdeaCard";
import Button from "../Button/Button";
import { MdAddCircle, MdArrowDownward, MdArrowUpward, MdCreate, MdMenu } from "react-icons/md";
import { IoMdFunnel } from "react-icons/io";
import PopupMenu from "../PopupMenu/PopupMenu";
import {
    deleteIdea,
    getIdeas,
    postIdea,
    putIdea,
    type Idea,
    type IdeaDeleteParams,
    type IdeaPutData,
    type IdeaPutParams,
} from "@/api/ideas";
import type { IdeaBoardProps, OrderChoices, SortByMenuItem } from "./types";
import type { IdeaCardSaveArgs } from "../IdeaCard/types";

const sortByOptions: SortByMenuItem[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Name", value: "name" },
];

export default function IdeaBoard({ selectedCollection, setIsSideBarOpen }: IdeaBoardProps) {
    const [ideas, setIdeas] = useState<Idea[] | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [order, setOrder] = useState<OrderChoices>("desc");
    const [selectedSortByOption, setSelectedSortByOption] = useState<SortByMenuItem>(sortByOptions[0]);

    function handleSortSelection(value: string) {
        const selection = sortByOptions.find((el) => el.value === value);

        if (selection) {
            setSelectedSortByOption(selection);
        }
    }

    async function createIdea(data: IdeaCardSaveArgs) {
        if (data.name) {
            try {
                const response = await postIdea({ name: data.name, collection: selectedCollection?.id });
                setIdeas((prev) => [response.data, ...(prev || [])]);
                setIsAdding(false);
            } catch (err: unknown) {
                console.error(err);
            }
        }
    }

    async function removeIdea(data: IdeaDeleteParams) {
        try {
            await deleteIdea(data);
            setIdeas((prev) => (prev || []).filter((el) => el.id !== data.id));
        } catch (err: unknown) {
            console.error(err);
        }
    }

    async function editIdea(data: IdeaPutData, params: IdeaPutParams) {
        try {
            const response = await putIdea(data, params);

            setIdeas((prev) => {
                return (prev || [])?.map((el) => (el.id === params.id ? response.data : el));
            });
        } catch (err: unknown) {
            console.error(err);
        }
    }

    useEffect(() => {
        async function fetchIdeas() {
            const params = {
                order,
                collection: selectedCollection?.id,
                sortBy: selectedSortByOption.value,
            };

            try {
                const response = await getIdeas(params);
                setIdeas(response.data);
            } catch (err: unknown) {
                console.error(err);
            }
        }

        fetchIdeas();
    }, [order, selectedCollection, selectedSortByOption]);

    return (
        <section className="relative flex flex-col w-full h-full overflow-hidden sm:rounded-2xl sm:bg-secondary-background-color after:absolute after:w-full after:h-full sm:after:inset-shadow-[0_0_8px_2px_rgba(0,0,0,0.75)] after:rounded-2xl after:pointer-events-none">
            <div className="w-full flex justify-between px-5 py-3 sm:px-8 sm:py-5 bg-[#222222]">
                <div className="flex items-center gap-5 max-w-full overflow-hidden">
                    <Button
                        Icon={MdMenu}
                        iconProps={{ size: 24 }}
                        variant="plain"
                        className="sm:hidden! cursor-pointer min-w-[24px]! p-0!"
                        onClick={() => setIsSideBarOpen(true)}
                    />
                    <h1 className="font-semibold text-2xl text-ellipsis text-nowrap overflow-hidden">
                        {selectedCollection?.name || "All Ideas"}
                    </h1>
                </div>
                {/* TO-DO: Make into component SortControls */}
                <div className="flex items-center gap-1.5 text-nowrap">
                    <PopupMenu
                        items={sortByOptions}
                        selectedItem={selectedSortByOption}
                        Icon={IoMdFunnel}
                        onSelection={handleSortSelection}
                    />
                    {/* Divider */}
                    <div className="h-full w-[1px] border-l border-l-stone-600"></div>
                    <Button
                        Icon={order === "asc" ? MdArrowUpward : MdArrowDownward}
                        text=""
                        variant="plain"
                        className="p-2!"
                        onClick={() => (order === "asc" ? setOrder("desc") : setOrder("asc"))}
                    />
                </div>
            </div>
            <div className="px-8! py-5! flex-grow overflow-auto">
                <div className="flex gap-10 flex-wrap">
                    {!isAdding && (
                        <>
                            {/* "New Idea" Button - Widescreen */}
                            <Button
                                variant="plain"
                                className="flex flex-col justify-center w-[var(--idea-card-size)] aspect-square text-stone-500 text-xl! border border-dashed focus:outline outline-white max-sm:hidden!"
                                onClick={() => setIsAdding(true)}
                                Icon={MdAddCircle}
                                iconProps={{ size: 80, className: "text-stone-600" }}
                                text="New Idea"
                            />
                            {/* "New Idea" Button - Mobile */}
                            <Button
                                Icon={MdCreate}
                                variant="primary"
                                className="fixed bottom-[20px] right-[20px] rounded-full aspect-square sm:hidden!"
                                onClick={() => setIsAdding(true)}
                            />
                        </>
                    )}
                    {isAdding && (
                        <IdeaCard
                            isNew={true}
                            onSave={(newIdea) => {
                                createIdea(newIdea);
                                setIsAdding(false);
                            }}
                            onDelete={() => {}}
                        />
                    )}
                    {ideas &&
                        ideas.map((idea) => (
                            <IdeaCard
                                key={idea.id}
                                idea={idea}
                                onSave={(data) => editIdea(data, { id: idea.id })}
                                onDelete={() => removeIdea({ id: idea.id })}
                            />
                        ))}
                </div>
            </div>
        </section>
    );
}
