import { useEffect, useState } from "react";
import IdeaCard from "../IdeaCard/IdeaCard";
import Button from "../Button/Button";
import { MdMenu } from "react-icons/md";
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
import type { IdeaBoardProps, OrderChoices, SortByCollection } from "./types";
import type { IdeaCardSaveArgs } from "../IdeaCard/types";
import SortControls from "../SortControls/SortControls";
import NewIdeaButton from "../NewIdeaButton/NewIdeaButton";

const sortByOptions: SortByCollection[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Name", value: "name" },
];

export default function IdeaBoard({ selectedCollection, setIsSideBarOpen }: IdeaBoardProps) {
    const [ideas, setIdeas] = useState<Idea[] | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [order, setOrder] = useState<OrderChoices>("desc");
    const [selectedSortByOption, setSelectedSortByOption] = useState<SortByCollection>(sortByOptions[0]);

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
            setIdeas((prev) => (prev || []).filter((idea) => idea.id !== data.id));
        } catch (err: unknown) {
            console.error(err);
        }
    }

    async function editIdea(data: IdeaPutData, params: IdeaPutParams) {
        try {
            const response = await putIdea(data, params);

            setIdeas((prev) => {
                return (prev || [])?.map((idea) => (idea.id === params.id ? response.data : idea));
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
        <main className="relative flex flex-col w-full h-full overflow-hidden sm:rounded-2xl sm:bg-secondary-background-color after:absolute after:w-full after:h-full sm:after:inset-shadow-[0_0_8px_2px_rgba(0,0,0,0.75)] after:rounded-2xl after:pointer-events-none">
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
                <SortControls
                    order={order}
                    setOrder={setOrder}
                    sortByOptions={sortByOptions}
                    selectedSortByOption={selectedSortByOption}
                    setSelectedSortByOption={setSelectedSortByOption}
                />
            </div>
            <div className="flex gap-10 flex-wrap px-8! py-5! overflow-auto">
                {!isAdding && <NewIdeaButton setIsAdding={setIsAdding} />}
                {isAdding && (
                    <IdeaCard
                        isNew={true}
                        onSave={(newIdea) => {
                            createIdea(newIdea);
                            setIsAdding(false);
                        }}
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
        </main>
    );
}
