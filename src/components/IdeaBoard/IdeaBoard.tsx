import { useState } from "react";
import IdeaCard from "../IdeaCard/IdeaCard";
import Button from "../Button/Button";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { type PopupMenuItem } from "../PopupMenu/types";
import type { MenuItem } from "../Menu/types";
import { IoMdFunnel } from "react-icons/io";
import PopupMenu from "../PopupMenu/PopupMenu";

interface Props {
    selectedCollection: MenuItem["value"] | undefined;
}

type OrderChoices = "asc" | "desc";

type SortByOptions = "createdAt" | "name";

type SortByMenuItem = PopupMenuItem<string, SortByOptions>;

const sortByOptions: SortByMenuItem[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Name", value: "name" },
];

export default function IdeaBoard({ selectedCollection }: Props) {
    const [isAdding, setIsAdding] = useState(false);
    const [order, setOrder] = useState<OrderChoices>("desc");
    const [selectedSortByOption, setSelectedSortByOption] = useState<SortByMenuItem>(sortByOptions[0]);

    function handleSortSelection(value: string) {
        const selection = sortByOptions.find((el) => el.value === value);

        if (selection) {
            setSelectedSortByOption(selection);
        }
    }

    return (
        <section className="relative flex flex-col w-full h-full overflow-hidden rounded-2xl sm:bg-secondary-background-color after:absolute after:w-full after:h-full after:inset-shadow-[0_0_8px_2px_rgba(0,0,0,0.75)] after:rounded-2xl after:pointer-events-none">
            <div className="w-full flex justify-between sm:px-8! sm:py-5! bg-[#222222]">
                <h1 className="font-semibold text-2xl">{selectedCollection}</h1>
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
            <div className="sm:px-8! sm:py-5! flex-grow">
                <div className="flex gap-10 flex-wrap">
                    <IdeaCard
                        empty={!isAdding}
                        onClick={() => {
                            if (!isAdding) {
                                setIsAdding(true);
                            }
                        }}
                    />
                    <IdeaCard name="Hi" description="" />
                </div>
            </div>
        </section>
    );
}
