import { MOCK_API_DELAY_AMOUNT } from "@/utils/constants";
import delay from "@/utils/delay";
import { localStorageGetOrCreate } from "@/utils/storage";
import { HttpStatusCode, type MockHttpResponse } from "./types/http";

export interface Idea {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    lastModified: string;
    collection?: string | null;
}

export interface IdeasGetParams {
    sortBy?: "createdAt" | "name";
    order?: "asc" | "desc";
    collection?: string | null;
}

export type IdeaPostData = { name: string; description?: string; collection?: string };

export type IdeaPutData = Partial<Pick<Idea, "name" | "description" | "collection">>;

export type IdeaPutParams = Pick<Idea, "id">;

export type IdeaDeleteParams = Pick<Idea, "id">;

const DEFAULT_SORT_BY_FIELD = "createdAt";
const DEFAULT_ORDER = "asc";

export async function getIdeas(params: IdeasGetParams): Promise<MockHttpResponse<Idea[]>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    let { order, sortBy } = params;

    if (!order) order = DEFAULT_ORDER;
    if (!sortBy) sortBy = DEFAULT_SORT_BY_FIELD;

    let ideas = JSON.parse(localStorageGetOrCreate("ideas", JSON.stringify([]))) as Idea[];

    if (params.collection) {
        ideas = ideas.filter((idea) => idea.collection === params.collection);
    }

    if (params.order === "desc") {
        ideas.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
    } else {
        ideas.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }

    return {
        status: HttpStatusCode.OK,
        data: ideas,
    };
}

export async function postIdea(data: IdeaPostData): Promise<MockHttpResponse<Idea>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const currentDateTime = new Date().toISOString();

    const newIdea: Idea = { createdAt: currentDateTime, lastModified: currentDateTime, id: crypto.randomUUID(), description: "", ...data };

    const ideas = JSON.parse(localStorageGetOrCreate("ideas", JSON.stringify([]))) as Idea[];

    localStorage.setItem("ideas", JSON.stringify([...ideas, newIdea]));

    const response = {
        status: HttpStatusCode.CREATED,
        data: newIdea,
    };

    return response;
}

export async function putIdea(data: IdeaPutData, params: IdeaPutParams): Promise<MockHttpResponse<Idea>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const ideas = JSON.parse(localStorageGetOrCreate("ideas", JSON.stringify([]))) as Idea[];

    const ideaToUpate = ideas.find((el) => el.id === params.id);

    if (!ideaToUpate) {
        throw new Error("Invalid ID provided");
    }

    for (const k in data) {
        const key = k as keyof typeof data;

        if (data[key]) {
            ideaToUpate[key] = data[key];
        }
    }

    ideaToUpate.lastModified = new Date().toISOString();

    localStorage.setItem("ideas", JSON.stringify([...ideas.filter((el) => el.id !== params.id), ideaToUpate]));

    return {
        status: HttpStatusCode.OK,
        data: ideaToUpate,
    };
}

export async function deleteIdea(params: IdeaDeleteParams): Promise<MockHttpResponse<string>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const ideas = JSON.parse(localStorageGetOrCreate("ideas", JSON.stringify([]))) as Idea[];

    if (!ideas.find((el) => el.id === params.id)) {
        throw new Error("Invalid ID provided");
    }

    localStorage.setItem("ideas", JSON.stringify(ideas.filter((el) => el.id !== params.id)));

    return {
        status: HttpStatusCode.NO_CONTENT,
        data: "",
    };
}
