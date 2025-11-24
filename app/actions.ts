"use server";

import { analyzeTradeQuery, TradeData } from "@/lib/gemini";
import { nanoid } from "nanoid";

export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    data?: TradeData;
};

export type ChatState = {
    messages: Message[];
};

export async function analyzeTradeData(prevState: ChatState, formData: FormData): Promise<ChatState> {
    const query = formData.get('query') as string;

    if (!query || query.trim() === '') {
        return prevState;
    }

    const userMessage: Message = {
        id: nanoid(),
        role: 'user',
        content: query,
    };

    // Optimistic update could be handled in client, but here we return the new state
    // actually useActionState waits for the server. useOptimistic is for immediate UI.

    try {
        const data = await analyzeTradeQuery(query);

        const aiMessage: Message = {
            id: nanoid(),
            role: 'assistant',
            content: "Here is the analysis based on your query.",
            data: data,
        };

        return {
            messages: [...prevState.messages, userMessage, aiMessage],
        };
    } catch (error) {
        console.error(error);
        const errorMessage: Message = {
            id: nanoid(),
            role: 'assistant',
            content: "I'm sorry, I couldn't analyze that data right now. Please try again.",
        };
        return {
            messages: [...prevState.messages, userMessage, errorMessage],
        };
    }
}
