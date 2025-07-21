import { MdAddCircle } from "react-icons/md";
import type { IdeaCardProps } from "./types";
import clsx from "clsx";

export default function IdeaCard({ empty, name, description, ...rest }: IdeaCardProps) {
    return (
        <div
            className={clsx("flex flex-col w-[300px] min-w-[300px] max-w-[300px] h-[300px] min-h-[300px] max-h-[300px] rounded-lg", {
                "border border-dashed border-[#6B6B6B] bg-[#2D2D2D] hover:bg-[#262626] cursor-pointer": empty,
            })}
            {...rest}
        >
            {empty ? (
                <div className="flex flex-col items-center m-auto! w-fit">
                    <MdAddCircle size={80} className="text-stone-600" />
                    <p className="text-2xl select-none text-stone-500">New Idea</p>
                </div>
            ) : (
                <>
                    <div className="bg-stone-950/50 w-full p-3! rounded-t-lg">
                        <h1 className="text-2xl">{name}</h1>
                        <small className="text-stone-600">Created yesterday. Modified yesterday</small>
                    </div>
                    <div className="h-full bg-stone-900/50 rounded-b-lg">{description}</div>
                </>
            )}
        </div>
    );
}
