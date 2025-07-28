import { useCallback, useEffect, useMemo, useState } from "react";
import IdeaCard from "../IdeaCard/IdeaCard";
import Button from "../Button/Button";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { IoMdFunnel } from "react-icons/io";
import PopupMenu from "../PopupMenu/PopupMenu";
import {
    deleteIdea,
    getIdeas,
    postIdea,
    putIdea,
    type Idea,
    type IdeaDeleteParams,
    type IdeaPostData,
    type IdeaPutData,
    type IdeaPutParams,
    type IdeasGetParams,
} from "@/api/ideas";
import AddIdeaButton from "../AddIdeaButton/AddIdeaButton";
import type { IdeaBoardProps, OrderChoices, SortByMenuItem } from "./types";

const sortByOptions: SortByMenuItem[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Name", value: "name" },
];

export default function IdeaBoard({ selectedCollection }: IdeaBoardProps) {
    const [ideas, setIdeas] = useState<Idea[] | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [order, setOrder] = useState<OrderChoices>("desc");
    const [selectedSortByOption, setSelectedSortByOption] = useState<SortByMenuItem>(sortByOptions[0]);

    const params = useMemo<IdeasGetParams>(() => {
        return {
            order,
            sortBy: selectedSortByOption.value,
        };
    }, [selectedSortByOption.value, order]);

    function handleSortSelection(value: string) {
        const selection = sortByOptions.find((el) => el.value === value);

        if (selection) {
            setSelectedSortByOption(selection);
        }
    }

    const fetchIdeas = useCallback(async () => {
        try {
            const response = await getIdeas(params);
            setIdeas(response.data);
        } catch (err: unknown) {
            console.error(err);
        }
    }, [params]);

    async function createIdea(data: IdeaPostData) {
        try {
            const response = await postIdea(data);
            setIdeas((prev) => [response.data, ...(prev || [])]);
            setIsAdding(false);
        } catch (err: unknown) {
            console.error(err);
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
        fetchIdeas();
    }, [fetchIdeas]);

    return (
        <section className="relative flex flex-col w-full h-full overflow-hidden sm:rounded-2xl sm:bg-secondary-background-color after:absolute after:w-full after:h-full sm:after:inset-shadow-[0_0_8px_2px_rgba(0,0,0,0.75)] after:rounded-2xl after:pointer-events-none">
            <div className="w-full flex justify-between px-5 py-3 sm:px-8 sm:py-5 bg-[#222222]">
                <h1 className="font-semibold text-2xl">{selectedCollection?.name || "All Ideas"}</h1>
                <div className="flex items-center gap-1.5">
                    <PopupMenu
                        items={sortByOptions}
                        selectedItem={selectedSortByOption}
                        Icon={IoMdFunnel}
                        onSelection={handleSortSelection}
                    />
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
                    <AddIdeaButton onClick={() => setIsAdding(true)} />
                    {isAdding && (
                        <IdeaCard name="" description="" isAdding={isAdding} onCreate={createIdea} onCancel={() => setIsAdding(false)} />
                    )}
                    {ideas &&
                        ideas.map((el) => (
                            <IdeaCard
                                key={el.id}
                                name={el.name}
                                description={el.description}
                                createdAt={el.createdAt}
                                lastModified={el.lastModified}
                                onDelete={() => removeIdea({ id: el.id })}
                                onSave={(data) => editIdea(data, { id: el.id })}
                            />
                        ))}
                </div>
            </div>
        </section>
    );
}
