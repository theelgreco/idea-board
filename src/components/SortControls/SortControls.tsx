import { IoMdFunnel } from "react-icons/io";
import Button from "../Button/Button";
import PopupMenu from "../PopupMenu/PopupMenu";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import type { PopupCollection } from "../PopupMenu/types";

export type OrderChoices = "asc" | "desc";

export type SortByOptions = "createdAt" | "name";

export type SortByCollection = PopupCollection<string, SortByOptions>;

interface SortControlsProps {
    order: OrderChoices;
    setOrder: React.Dispatch<React.SetStateAction<OrderChoices>>;
    sortByOptions: SortByCollection[];
    selectedSortByOption: SortByCollection;
    setSelectedSortByOption: React.Dispatch<React.SetStateAction<SortByCollection>>;
}

export default function SortControls({ order, setOrder, sortByOptions, selectedSortByOption, setSelectedSortByOption }: SortControlsProps) {
    function handleSortSelection(value: string) {
        const selection = sortByOptions.find((sortByOption) => sortByOption.value === value);

        if (selection) {
            setSelectedSortByOption(selection);
        }
    }

    return (
        <div className="flex items-center gap-1.5 text-nowrap">
            <PopupMenu items={sortByOptions} selectedItem={selectedSortByOption} Icon={IoMdFunnel} onSelection={handleSortSelection} />
            <hr className="border-l h-full" />
            <Button
                Icon={order === "asc" ? MdArrowUpward : MdArrowDownward}
                text=""
                variant="plain"
                className="p-2!"
                onClick={() => (order === "asc" ? setOrder("desc") : setOrder("asc"))}
            />
        </div>
    );
}
