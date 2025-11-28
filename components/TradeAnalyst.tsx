"use client";

import React, { useActionState, useRef, useEffect, useOptimistic, startTransition, useState } from 'react';
import { Send, Sparkles, LayoutDashboard, History, Menu, TrendingUp, ChevronLeft, ChevronRight, SlidersHorizontal, X, Loader2, Home } from 'lucide-react';
import { analyzeTradeData, ChatState, Message, generateQueryFromFiltersAction } from '@/app/actions';
import { TradeDashboard } from './dashboard/TradeDashboard';
import { InsightsDashboard } from './dashboard/InsightsDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { TradeData } from '@/lib/gemini';
import Image from 'next/image';
import { FilterPanel, FilterValues } from './filters/FilterPanel';
import { Tooltip } from './ui/Tooltip';
import { ExportButton } from './ExportButton';

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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [activeView, setActiveView] = useState<'historical' | 'predictions'>('historical');
    const [filters, setFilters] = useState<FilterValues>({
        sectors: [],
        yearFrom: '2010',
        yearTo: '2025',
        countries: [],
        tradeType: 'both',
    });
    const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(null);
    const [isGeneratingQuery, setIsGeneratingQuery] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

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

    // Auto-apply filters whenever they change
    const handleFilterChange = (newFilters: FilterValues) => {
        setFilters(newFilters);
        setAppliedFilters(newFilters);
    };

    const handleResetFilters = () => {
        const defaultFilters: FilterValues = {
            sectors: [],
            yearFrom: '2010',
            yearTo: '2025',
            countries: [],
            tradeType: 'both',
        };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const removeFilter = (filterType: 'sector' | 'country', value: string) => {
        let newFilters: FilterValues;
        if (filterType === 'sector') {
            newFilters = { ...filters, sectors: filters.sectors.filter(s => s !== value) };
        } else {
            newFilters = { ...filters, countries: filters.countries.filter(c => c !== value) };
        }
        setFilters(newFilters);
        setAppliedFilters(newFilters);
    };

    // Toggle filter panel and generate query when closing
    const toggleFilterPanel = async () => {
        // If panel is open and we're closing it
        if (filterPanelOpen) {
            setFilterPanelOpen(false);

            // Check if any filters are active
            const hasActiveFilters =
                filters.sectors.length > 0 ||
                filters.countries.length > 0 ||
                filters.tradeType !== 'both' ||
                filters.yearFrom !== '2010' ||
                filters.yearTo !== '2025';

            if (hasActiveFilters) {
                // Generate query from filters
                setIsGeneratingQuery(true);
                try {
                    const generatedQuery = await generateQueryFromFiltersAction(filters);
                    if (inputRef.current) {
                        inputRef.current.value = generatedQuery;
                        inputRef.current.focus();
                    }
                } catch (error) {
                    console.error('Error generating query:', error);
                } finally {
                    setIsGeneratingQuery(false);
                }
            }
        } else {
            // Just open the panel
            setFilterPanelOpen(true);
        }
    };

    const handleSubmit = (formData: FormData) => {
        const query = formData.get('query') as string;
        if (!query.trim()) return;

        // Append filter data to formData if filters are applied
        if (appliedFilters) {
            formData.append('filters', JSON.stringify(appliedFilters));
        }

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
        <div className="flex h-screen bg-background overflow-hidden font-roboto text-foreground selection:bg-primary/20">
            {/* Left Sidebar - Chat Interface */}
            <motion.div
                initial={false}
                animate={{
                    width: sidebarOpen ? '420px' : '0px',
                    opacity: sidebarOpen ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col glass-panel relative z-20 overflow-hidden"
            >
                {/* Header with Vibrant Gradient */}
                <div className="relative p-6 border-b border-white/30 gradient-header overflow-hidden">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 gradient-animated opacity-30"></div>

                    <div className="relative flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl text-white shadow-lg glow-effect">
                            <Sparkles size={24} className="animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <h1 className="font-bold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Trade Agent
                            </h1>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Powered by Gemini 3 Pro
                            </p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="relative flex items-center gap-2 mt-4">
                        <Tooltip content="Back to Landing Page">
                            <motion.a
                                href="/"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white rounded-xl shadow-lg hover:shadow-orange-500/40 transition-all font-semibold text-sm"
                            >
                                <Home size={18} strokeWidth={2.5} />
                                <span>Home</span>
                            </motion.a>
                        </Tooltip>

                        <Tooltip content="View Saved Analyses">
                            <motion.a
                                href="/dashboard/saved"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-emerald-500/40 transition-all font-semibold text-sm"
                            >
                                <History size={18} strokeWidth={2.5} />
                                <span>Saved</span>
                            </motion.a>
                        </Tooltip>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth">
                    {optimisticMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className={`flex gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`
                                w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-lg
                                ${msg.role === 'assistant'
                                    ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-indigo-500/30 glow-effect'
                                    : 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/20'}
                            `}>
                                {msg.role === 'assistant' ? (
                                    <Image src="/images/logo.png" alt="Trade AI" width={24} height={24} className="brightness-90" />
                                ) : (
                                    <Image src="/images/rupee.png" alt="User" width={20} height={20} className="opacity-75" />
                                )}
                            </div>

                            <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`
                                    px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed shadow-lg backdrop-blur-sm font-medium
                                    ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-tr-md shadow-indigo-500/20'
                                        : 'bg-white/90 border border-indigo-100 text-slate-700 rounded-tl-md shadow-indigo-500/5'}
                                `}>
                                    {msg.content}
                                </div>

                                {msg.data && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveData(msg.data!)}
                                        className="group flex items-center gap-2 mt-0.5 ml-1 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 transition-all cursor-pointer shadow-sm"
                                    >
                                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white group-hover:scale-110 transition-transform shadow-sm">
                                            <LayoutDashboard size={14} />
                                        </div>
                                        <span className="text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            View Dashboard
                                        </span>
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isPending && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3.5"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 glow-effect">
                                <Image src="/images/logo.png" alt="Trade AI" width={24} height={24} className="brightness-90 animate-pulse" />
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl bg-white/90 border border-indigo-100 shadow-lg rounded-tl-md text-sm text-slate-600 flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                <span className="font-medium">Analyzing...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Filter Panel */}
                <FilterPanel
                    isOpen={filterPanelOpen}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                />

                {/* Active Filters Display */}
                {appliedFilters && (appliedFilters.sectors.length > 0 || appliedFilters.countries.length > 0 || appliedFilters.tradeType !== 'both' || appliedFilters.yearFrom !== '2010' || appliedFilters.yearTo !== '2025') && (
                    <div className="px-5 py-3 bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-t border-orange-200/50 flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-bold text-slate-600">Active Filters:</span>
                        {appliedFilters.sectors.map(sector => (
                            <motion.div
                                key={sector}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xs font-semibold shadow-sm"
                            >
                                {sector}
                                <button onClick={() => removeFilter('sector', sector)} className="hover:bg-white/20 rounded p-0.5">
                                    <X size={12} />
                                </button>
                            </motion.div>
                        ))}
                        {appliedFilters.countries.map(country => (
                            <motion.div
                                key={country}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-sm"
                            >
                                {country}
                                <button onClick={() => removeFilter('country', country)} className="hover:bg-white/20 rounded p-0.5">
                                    <X size={12} />
                                </button>
                            </motion.div>
                        ))}
                        {appliedFilters.tradeType !== 'both' && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-semibold shadow-sm"
                            >
                                {appliedFilters.tradeType.charAt(0).toUpperCase() + appliedFilters.tradeType.slice(1)} Only
                            </motion.div>
                        )}
                        {(appliedFilters.yearFrom !== '2010' || appliedFilters.yearTo !== '2025') && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="px-2.5 py-1 rounded-lg bg-blue-500 text-white text-xs font-semibold shadow-sm"
                            >
                                {appliedFilters.yearFrom} - {appliedFilters.yearTo}
                            </motion.div>
                        )}
                        <button
                            onClick={handleResetFilters}
                            className="ml-auto text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                )}

                {/* Modern Input Area */}
                <div className="relative p-5 bg-gradient-to-r from-white/70 via-indigo-50/50 to-purple-50/50 backdrop-blur-md border-t border-indigo-100">
                    {/* Filter Toggle Button */}
                    <div className="mb-3 flex justify-end">
                        <Tooltip
                            content="Select filters and close panel to auto-generate query"
                            disabled={isGeneratingQuery || filterPanelOpen}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleFilterPanel}
                                disabled={isGeneratingQuery}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    filterPanelOpen
                                        ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/30'
                                        : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-orange-300'
                                }`}
                            >
                                {isGeneratingQuery ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <SlidersHorizontal size={16} strokeWidth={2.5} />
                                        Advanced Filters
                                        {appliedFilters && (appliedFilters.sectors.length > 0 || appliedFilters.countries.length > 0 || appliedFilters.tradeType !== 'both' || appliedFilters.yearFrom !== '2010' || appliedFilters.yearTo !== '2025') && (
                                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/30 text-xs font-bold">
                                                {(appliedFilters.sectors.length + appliedFilters.countries.length + (appliedFilters.tradeType !== 'both' ? 1 : 0) + (appliedFilters.yearFrom !== '2010' || appliedFilters.yearTo !== '2025' ? 1 : 0))}
                                            </span>
                                        )}
                                    </>
                                )}
                            </motion.button>
                        </Tooltip>
                    </div>

                    <form ref={formRef} action={handleSubmit} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <input
                            ref={inputRef}
                            name="query"
                            type="text"
                            placeholder="Ask about trade data..."
                            className="w-full pl-5 pr-16 py-4 rounded-2xl bg-white/90 border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all text-sm font-medium shadow-lg relative z-10 placeholder:text-slate-400"
                            autoComplete="off"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isPending}
                            className="absolute right-2.5 top-2.5 p-2.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20 shadow-md"
                        >
                            <Send size={18} strokeWidth={2.5} />
                        </motion.button>
                    </form>
                </div>
            </motion.div>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed left-4 top-6 z-30 p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all glow-effect"
            >
                <motion.div
                    animate={{ rotate: sidebarOpen ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    {sidebarOpen ? <ChevronLeft size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5} />}
                </motion.div>
            </motion.button>

            {/* Right Canvas - Insight Deck */}
            <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-50/50">
                {/* Dynamic Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                    <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-pink-500/5 blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
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
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                                            Trade Insights
                                        </h2>
                                        <p className="text-slate-600 mt-2 font-semibold">Real-time analysis powered by AI</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 text-xs font-bold text-emerald-700 shadow-lg backdrop-blur-sm flex items-center gap-2.5">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </span>
                                            Live Data
                                        </div>
                                        <ExportButton
                                            contentRef={dashboardRef}
                                            activeView={activeView}
                                            disabled={!activeData}
                                        />
                                    </div>
                                </div>

                                {/* Tab Switcher */}
                                <div className="flex items-center gap-3 mb-8">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveView('historical')}
                                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                                            activeView === 'historical'
                                                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-indigo-500/30'
                                                : 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-orange-500/30 hover:shadow-orange-500/50'
                                        }`}
                                    >
                                        📊 Historical Analysis
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveView('predictions')}
                                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                                            activeView === 'predictions'
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/30'
                                                : 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-orange-500/30 hover:shadow-orange-500/50'
                                        }`}
                                    >
                                        🤖 AI Predictions
                                    </motion.button>
                                </div>

                                {/* Conditional Rendering Based on Active View */}
                                <div ref={dashboardRef} id="dashboard-content">
                                    <AnimatePresence mode="wait">
                                        {activeView === 'historical' ? (
                                            <motion.div
                                                key="historical"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <TradeDashboard
                                                    data={activeData}
                                                    yearFrom={appliedFilters?.yearFrom}
                                                    yearTo={appliedFilters?.yearTo}
                                                    selectedSectors={appliedFilters?.sectors}
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="predictions"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <InsightsDashboard data={activeData} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center px-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                    className="relative mb-12 group"
                                >
                                    {/* Glow effect background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-3xl group-hover:blur-4xl transition-all duration-500 scale-125"></div>

                                    {/* Logo image only - no background box */}
                                    <Image
                                        src="/images/bgimage.png"
                                        alt="Indian Trade Analysis Logo"
                                        width={320}
                                        height={320}
                                        className="relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 rounded-[2.5rem]"
                                        priority
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Ready to Analyze
                                    </h3>
                                    <p className="max-w-2xl text-slate-600 leading-relaxed font-medium text-lg">
                                        Ask questions like <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">"Show me India's electronics exports"</span> to generate comprehensive, interactive dashboards with real-time data powered by AI.
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
