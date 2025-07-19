import IdeaCard from "../IdeaCard/IdeaCard";

export default function IdeaBoard() {
    return (
        <section className="sm:p-10! h-full w-full rounded-2xl sm:bg-secondary-background-color sm:inset-shadow-[0_0_8px_2px_rgba(0,0,0,0.75)]">
            <div className="flex gap-10 flex-wrap">
                <IdeaCard empty />
                <IdeaCard name="Hi" description="" />
            </div>
        </section>
    );
}
