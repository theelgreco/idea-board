import { MOCK_API_DELAY_AMOUNT } from "@/utils/constants";
import delay from "../utils/delay";
import { localStorageGetOrCreate } from "../utils/storage";
import { HttpStatusCode, type MockHttpResponse } from "./types";
import { FieldRequiredError, UniqueConstraintError } from "@/utils/errors";

export interface Collection {
    id: string;
    name: string;
    createdAt: string;
}

interface CollectionPostData {
    name: string;
}

interface CollectionPatchData {
    name: string;
}

interface CollectionPatchParams {
    id: string;
}

interface CollectionDeleteParams {
    id: string;
}

export async function getCollections(): Promise<MockHttpResponse<Collection[]>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const collections = JSON.parse(localStorageGetOrCreate("collections", JSON.stringify([]))) as Collection[];

    const response = {
        status: HttpStatusCode.OK,
        data: collections,
    };

    return response;
}

export async function postCollection(data: CollectionPostData): Promise<MockHttpResponse<Collection>> {
    if (!data.name) {
        throw new FieldRequiredError({ fields: ["name"] });
    }

    await delay(MOCK_API_DELAY_AMOUNT);

    const newCollection: Collection = { ...data, createdAt: new Date().toISOString(), id: crypto.randomUUID() };

    const collections = JSON.parse(localStorageGetOrCreate("collections", JSON.stringify([]))) as Collection[];

    if (collections.some((el) => el.name === data.name)) {
        throw new UniqueConstraintError({ fields: ["name"] });
    }

    localStorage.setItem("collections", JSON.stringify([...collections, newCollection]));

    const response = {
        status: HttpStatusCode.CREATED,
        data: newCollection,
    };

    return response;
}

export async function patchCollection(data: CollectionPatchData, params: CollectionPatchParams): Promise<MockHttpResponse<Collection>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const collections = JSON.parse(localStorageGetOrCreate("collections", JSON.stringify([]))) as Collection[];

    const collectionToUpate = collections.find((el) => el.id === params.id);

    if (collections.some((el) => el.name === data.name)) {
        throw new UniqueConstraintError({ fields: ["name"] });
    }

    if (!collectionToUpate) {
        throw new Error("Invalid ID provided");
    }

    localStorage.setItem(
        "collections",
        JSON.stringify([...collections.filter((el) => el.id !== params.id), { ...collectionToUpate, name: data.name }])
    );

    return {
        status: HttpStatusCode.OK,
        data: collectionToUpate,
    };
}

export async function deleteCollection(params: CollectionDeleteParams): Promise<MockHttpResponse<string>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const collections = JSON.parse(localStorageGetOrCreate("collections", JSON.stringify([]))) as Collection[];

    if (!collections.find((el) => el.id === params.id)) {
        throw new Error("Invalid ID provided");
    }

    localStorage.setItem("collections", JSON.stringify(collections.filter((el) => el.id !== params.id)));

    return {
        status: HttpStatusCode.NO_CONTENT,
        data: "",
    };
}
