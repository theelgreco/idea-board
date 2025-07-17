import { MOCK_API_DELAY_AMOUNT } from "@/utils/constants";
import delay from "../utils/delay";
import { localStorageGetOrCreate } from "../utils/storage";
import { type MockHttpResponse } from "./types";
import { FieldRequiredError, UniqueConstraintError } from "@/utils/errors";

export interface Collection {
    name: string;
    createdAt: string;
}

interface CollectionPostData {
    name: string;
}

export async function fetchCollections(): Promise<MockHttpResponse<Collection[]>> {
    await delay(MOCK_API_DELAY_AMOUNT);

    const collections = localStorageGetOrCreate("collections", JSON.stringify([]));

    const response = {
        status: 200,
        data: JSON.parse(collections),
    };

    return response;
}

export async function postCollection(data: CollectionPostData): Promise<MockHttpResponse<Collection>> {
    if (!data.name) {
        throw new FieldRequiredError({ fields: ["name"] });
    }

    await delay(MOCK_API_DELAY_AMOUNT);

    const newCollection: Collection = { ...data, createdAt: new Date().toISOString() };

    const collections = JSON.parse(localStorageGetOrCreate("collections", JSON.stringify([]))) as Collection[];

    if (collections.some((el) => el.name === data.name)) {
        throw new UniqueConstraintError({ fields: ["name"] });
    }

    localStorage.setItem("collections", JSON.stringify([...collections, newCollection]));

    const response = {
        status: 201,
        data: newCollection,
    };

    return response;
}
