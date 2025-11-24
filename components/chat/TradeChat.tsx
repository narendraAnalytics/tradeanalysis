"use client";

import React, { useActionState, useRef, useEffect, useOptimistic, startTransition } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { analyzeTradeData, ChatState, Message } from '@/app/actions';
import { TradeDashboard } from '../dashboard/TradeDashboard';
import { motion, AnimatePresence } from 'framer-motion';

const initialState: ChatState = {
    messages: [{
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your India Trade Agent. Ask me about imports, exports, or trade trends (e.g., 'Show me Steel exports 2015-2024')."
    }],
};

export function TradeChat() {
    const [state, formAction, isPending] = useActionState(analyzeTradeData, initialState);
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        state.messages,
        (currentMessages, newMessage: Message) => [...currentMessages, newMessage]
    );
    const formRef = useRef<HTMLFormElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [optimisticMessages]);

    const handleSubmit = (formData: FormData) => {
        const query = formData.get('query') as string;
        if (!query.trim()) return;

        startTransition(() => {
            addOptimisticMessage({
                id: 'optimistic-user',
                role: 'user',
                content: query
            });
            addOptimisticMessage({
                id: 'optimistic-ai',
                role: 'assistant',
                content: "Analyzing trade data..."
            });
        });

        formAction(formData);
        formRef.current?.reset();
    };

    return (
        <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl border-r border-white/20 relative overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-black/5 flex items-center gap-3 bg-white/40 backdrop-blur-md z-10">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight">Trade Agent</h1>
                    <p className="text-xs text-muted-foreground">Powered by Gemini 3 Pro</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
                {optimisticMessages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`
              w-10 h-10 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'assistant' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white border border-border text-foreground'}
            `}>
                            {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                        </div>

                        <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`
                p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user'
                                    ? 'bg-foreground text-background rounded-tr-sm'
                                    : 'bg-white border border-white/50 shadow-sm rounded-tl-sm'}
              `}>
                                {msg.content}
                            </div>

                            {msg.data && (
                                <div className="w-full mt-2">
                                    <TradeDashboard data={msg.data} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isPending && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 animate-pulse">
                            <Bot size={20} />
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-white/50 shadow-sm rounded-tl-sm text-sm text-muted-foreground animate-pulse">
                            Gathering insights from global markets...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white/60 backdrop-blur-md border-t border-white/20 z-10">
                <form ref={formRef} action={handleSubmit} className="relative">
                    <input
                        name="query"
                        type="text"
                        placeholder="Ask about India's trade (e.g., 'Steel exports 2023')..."
                        className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-lg shadow-black/5 transition-all"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="absolute right-3 top-3 p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
