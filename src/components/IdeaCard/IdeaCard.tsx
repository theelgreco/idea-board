import { MdAddCircle } from "react-icons/md";
import type { IdeaCardProps } from "./types";

export default function IdeaCard({ empty }: IdeaCardProps) {
    return (
        <div className="flex flex-col w-[300px] min-w-[300px] max-w-[300px] h-[300px] min-h-[300px] max-h-[300px]rounded-lg">
            {empty ? (
                <>
                    <MdAddCircle size={80} className="text-stone-600" />
                    <p className="text-2xl select-none text-stone-500">New Idea</p>
                </>
            ) : (
                <>
                    <div className="bg-stone-950/50 w-full p-3! rounded-t-lg">
                        <h1 className="text-2xl">Hello</h1>
                        <small className="text-stone-600">Created yesterday. Modified yesterday</small>
                    </div>
                    <div className="h-full bg-stone-900/50 rounded-b-lg border border-stone-950/50"></div>
                </>
            )}
        </div>
    );
}
