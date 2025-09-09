import { MOCK_API_DELAY_AMOUNT } from "@/lib/constants";
import delay from "../lib/delay";
import { localStorageGetOrCreate } from "../lib/storage";
import { HttpStatusCode, type MockHttpResponse } from "./types/http";
import { FieldRequiredError, UniqueConstraintError } from "@/api/types/errors";

export interface Collection {
    id: string;
    name: string;
    createdAt: string;
}

type CollectionPostData = Pick<Collection, "name">;

type CollectionPatchData = Pick<Collection, "name">;

type CollectionPatchParams = Pick<Collection, "id">;

type CollectionDeleteParams = Pick<Collection, "id">;

export async function getCollections(): Promise<MockHttpResponse<Collection[]>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const collections = JSON.parse(localStorageGetOrCreate("collections", JSON.stringify([]))) as Collection[];

    return {
        status: HttpStatusCode.OK,
        data: collections.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    };
}

export async function postCollection(data: CollectionPostData): Promise<MockHttpResponse<Collection>> {
    if (!data.name) {
        throw new FieldRequiredError({ fields: ["name"] });
    }

    await delay(MOCK_API_DELAY_AMOUNT);

    const newCollection: Collection = { ...data, createdAt: new Date().toISOString(), id: crypto.randomUUID() };

    const collections = JSON.parse(localStorageGetOrCreate("collections", JSON.stringify([]))) as Collection[];

    if (collections.some((collection) => collection.name === data.name)) {
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

    const collectionToUpate = collections.find((collection) => collection.id === params.id);

    if (collections.some((collection) => collection.name === data.name)) {
        throw new UniqueConstraintError({ fields: ["name"] });
    }

    if (!collectionToUpate) {
        throw new Error("Invalid ID provided");
    }

    const updatedCollection = { ...collectionToUpate, name: data.name };

    localStorage.setItem(
        "collections",
        JSON.stringify([...collections.filter((collection) => collection.id !== params.id), updatedCollection])
    );

    return {
        status: HttpStatusCode.OK,
        data: updatedCollection,
    };
}

export async function deleteCollection(params: CollectionDeleteParams): Promise<MockHttpResponse<string>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const collections = JSON.parse(localStorageGetOrCreate("collections", JSON.stringify([]))) as Collection[];

    if (!collections.find((collection) => collection.id === params.id)) {
        throw new Error("Invalid ID provided");
    }

    localStorage.setItem("collections", JSON.stringify(collections.filter((collection) => collection.id !== params.id)));

    return {
        status: HttpStatusCode.NO_CONTENT,
        data: "",
    };
}
