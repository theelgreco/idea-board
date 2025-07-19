import { MOCK_API_DELAY_AMOUNT } from "@/utils/constants";
import delay from "@/utils/delay";

export interface Idea {
    name: string;
    description: string;
    createdAt: string;
    lastModified: string;
}

async function fetchIdeas() {
    await delay(MOCK_API_DELAY_AMOUNT);
}
