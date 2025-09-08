import { useCallback, useEffect, useState } from "react";
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
import type { IdeaCardSaveArgs } from "../IdeaCard/IdeaCard";
import { type OrderChoices, type SortByCollection } from "../SortControls/SortControls";
import type { Collection } from "@/api/collections";
import IdeaBoardHeader from "./IdeaBoardHeader";
import IdeaBoardContent from "./IdeaBoardContent";

const sortByOptions: SortByCollection[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Name", value: "name" },
];

interface IdeaBoardProps {
    selectedCollection: Collection | null;
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IdeaBoard({ selectedCollection, setIsSideBarOpen }: IdeaBoardProps) {
    const [ideas, setIdeas] = useState<Idea[] | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [order, setOrder] = useState<OrderChoices>("desc");
    const [selectedSortByOption, setSelectedSortByOption] = useState<SortByCollection>(sortByOptions[0]);
    const [lastAddedIdeaId, setLastAddedIdeaId] = useState<string | null>(null);

    const fetchIdeas = useCallback(async () => {
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
    }, [order, selectedCollection, selectedSortByOption]);

    async function createIdea(data: IdeaCardSaveArgs) {
        if (data.name) {
            try {
                const response = await postIdea({ name: data.name, collection: selectedCollection?.id });
                setIdeas((prev) => [response.data, ...(prev || [])]);
                setLastAddedIdeaId(response.data.id);
            } catch (err: unknown) {
                console.error(err);
            } finally {
                setIsAdding(false);
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
        fetchIdeas();
    }, [fetchIdeas]);

    return (
        <main className="relative flex flex-col w-full h-full overflow-hidden sm:rounded-2xl sm:bg-secondary-background-color after:absolute after:w-full after:h-full sm:after:inset-shadow-[0_0_8px_2px_rgba(0,0,0,0.75)] after:rounded-2xl after:pointer-events-none">
            <IdeaBoardHeader
                selectedCollection={selectedCollection}
                order={order}
                sortByOptions={sortByOptions}
                selectedSortByOption={selectedSortByOption}
                setSelectedSortByOption={setSelectedSortByOption}
                setOrder={setOrder}
                setIsSideBarOpen={setIsSideBarOpen}
            />
            <IdeaBoardContent
                ideas={ideas}
                isAdding={isAdding}
                lastAddedIdeaId={lastAddedIdeaId}
                setIsAdding={setIsAdding}
                createIdea={createIdea}
                editIdea={editIdea}
                removeIdea={removeIdea}
            />
        </main>
    );
}
