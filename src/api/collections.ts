import { MOCK_API_DELAY_AMOUNT } from "@/utils/constants";
import delay from "../utils/delay";
import { localStorageGetOrCreate } from "../utils/storage";
import type { MockHttpResponse } from "./types";

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
    await delay(MOCK_API_DELAY_AMOUNT);

    const newCollection: Collection = { ...data, createdAt: new Date().toISOString() };

    // It should exist in the localStorage at this point, but doing this just in case it's not for extra safety
    const collections = localStorageGetOrCreate("collections", JSON.stringify([]));

    localStorage.setItem("collections", JSON.stringify([...JSON.parse(collections), newCollection]));

    const response = {
        status: 201,
        data: newCollection,
    };

    return response;
}
