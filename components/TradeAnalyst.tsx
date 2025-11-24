"use client";

import React, { useActionState, useRef, useEffect, useOptimistic, startTransition, useState } from 'react';
import { Send, Bot, User, Sparkles, LayoutDashboard, History, Menu, TrendingUp } from 'lucide-react';
import { analyzeTradeData, ChatState, Message } from '@/app/actions';
import { TradeDashboard } from './dashboard/TradeDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { TradeData } from '@/lib/gemini';

const initialState: ChatState = {
    messages: [{
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your India Trade Agent. Ask me about imports, exports, or trade trends (e.g., 'Show me Steel exports 2015-2024')."
    }],
};

export function TradeAnalyst() {
    const [state, formAction, isPending] = useActionState(analyzeTradeData, initialState);
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        state.messages,
        (currentMessages, newMessage: Message) => [...currentMessages, newMessage]
    );

    const [activeData, setActiveData] = useState<TradeData | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Update active data when a new message with data arrives
    useEffect(() => {
        const lastMessageWithData = state.messages.findLast(m => m.data);
        if (lastMessageWithData && lastMessageWithData.data) {
            setActiveData(lastMessageWithData.data);
        }
    }, [state.messages]);

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
        <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground selection:bg-primary/20">
            {/* Left Sidebar - Chat Interface */}
            <div className="w-[35%] min-w-[380px] flex flex-col glass-panel relative z-20">
                {/* Header */}
                <div className="p-6 border-b border-white/20 flex items-center gap-4 bg-white/40 backdrop-blur-md">
                    <div className="p-2.5 bg-gradient-to-br from-primary to-indigo-600 rounded-xl text-white shadow-lg shadow-primary/25">
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight text-slate-900">Trade Agent</h1>
                        <p className="text-xs font-medium text-slate-500">Powered by Gemini 3 Pro</p>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth">
                    {optimisticMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`
                                w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm
                                ${msg.role === 'assistant'
                                    ? 'bg-gradient-to-br from-primary to-indigo-600 text-white shadow-primary/20'
                                    : 'bg-white border border-slate-200 text-slate-600'}
                            `}>
                                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                            </div>

                            <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`
                                    p-4 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm
                                    ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-tr-sm shadow-slate-900/10'
                                        : 'bg-white/80 border border-white/50 text-slate-700 rounded-tl-sm shadow-sm'}
                                `}>
                                    {msg.content}
                                </div>

                                {msg.data && (
                                    <button
                                        onClick={() => setActiveData(msg.data!)}
                                        className="group flex items-center gap-2 mt-1 ml-1 px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all cursor-pointer"
                                    >
                                        <div className="p-1 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                            <LayoutDashboard size={12} />
                                        </div>
                                        <span className="text-xs font-semibold text-primary">View Dashboard</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isPending && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <Bot size={18} className="animate-pulse" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white/80 border border-white/50 shadow-sm rounded-tl-sm text-sm text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-5 bg-white/60 backdrop-blur-md border-t border-white/20">
                    <form ref={formRef} action={handleSubmit} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <input
                            name="query"
                            type="text"
                            placeholder="Ask about trade data..."
                            className="w-full pl-5 pr-14 py-4 rounded-xl bg-white border border-slate-200 focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all text-sm shadow-sm relative z-10 placeholder:text-slate-400"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={isPending}
                            className="absolute right-2.5 top-2.5 p-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Canvas - Insight Deck */}
            <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-50/50">
                {/* Dynamic Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                    <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
                </div>

                <div className="flex-1 overflow-y-auto p-8 relative z-10">
                    <AnimatePresence mode="wait">
                        {activeData ? (
                            <motion.div
                                key={activeData.stats.totalVolume}
                                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trade Insights</h2>
                                        <p className="text-slate-500 mt-1 font-medium">Real-time analysis based on your query</p>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-white/80 border border-white/50 text-xs font-semibold text-emerald-600 shadow-sm backdrop-blur-sm flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        Live Data
                                    </div>
                                </div>

                                <TradeDashboard data={activeData} />
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="w-32 h-32 rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-indigo-500/10 flex items-center justify-center mb-8 relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-[2rem]" />
                                    <TrendingUp size={48} className="text-indigo-500/40 group-hover:scale-110 transition-transform duration-500" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Analyze</h3>
                                    <p className="max-w-md text-slate-500 leading-relaxed">
                                        Ask questions like "Show me India's electronics exports" to generate comprehensive, interactive dashboards.
                                    </p>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
