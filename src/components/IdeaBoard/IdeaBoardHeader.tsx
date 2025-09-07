import { MdMenu } from "react-icons/md";
import Button from "../Button/Button";
import SortControls, { type OrderChoices, type SortByCollection } from "../SortControls/SortControls";
import type { Collection } from "@/api/collections";

interface IdeaBoardHeaderProps {
    selectedCollection: Collection | null;
    order: OrderChoices;
    sortByOptions: SortByCollection[];
    selectedSortByOption: SortByCollection;
    setSelectedSortByOption: React.Dispatch<React.SetStateAction<SortByCollection>>;
    setOrder: React.Dispatch<React.SetStateAction<OrderChoices>>;
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IdeaBoardHeader({
    selectedCollection,
    order,
    sortByOptions,
    selectedSortByOption,
    setSelectedSortByOption,
    setOrder,
    setIsSideBarOpen,
}: IdeaBoardHeaderProps) {
    return (
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
    );
}
