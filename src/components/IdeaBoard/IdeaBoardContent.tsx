import type { Idea, IdeaDeleteParams, IdeaPutData, IdeaPutParams } from "@/api/ideas";
import IdeaCard, { type IdeaCardSaveArgs } from "../IdeaCard/IdeaCard";
import NewIdeaButton from "../NewIdeaButton/NewIdeaButton";

interface IdeaBoardContentProps {
    ideas: Idea[] | null;
    isAdding: boolean;
    lastAddedIdeaId: string | null;
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
    createIdea: (data: IdeaCardSaveArgs) => void;
    editIdea: (data: IdeaPutData, params: IdeaPutParams) => void;
    removeIdea: (data: IdeaDeleteParams) => void;
}

export default function IdeaBoardContent({
    ideas,
    isAdding,
    lastAddedIdeaId,
    setIsAdding,
    createIdea,
    editIdea,
    removeIdea,
}: IdeaBoardContentProps) {
    return (
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
                        autoFocusDescription={idea.id === lastAddedIdeaId} // Autofocuses the description on a newly added idea
                        onSave={(data) => editIdea(data, { id: idea.id })}
                        onDelete={() => removeIdea({ id: idea.id })}
                    />
                ))}
        </div>
    );
}
