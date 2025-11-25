"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

export type FilterValues = {
    sectors: string[];
    yearFrom: string;
    yearTo: string;
    countries: string[];
    tradeType: 'imports' | 'exports' | 'both';
};

type FilterPanelProps = {
    isOpen: boolean;
    filters: FilterValues;
    onFilterChange: (filters: FilterValues) => void;
    onReset: () => void;
};

const SECTORS = [
    'Electronics',
    'Petroleum & Oil',
    'Gems & Jewelry',
    'Pharmaceuticals',
    'Machinery',
    'Chemicals',
    'Agriculture',
    'Textiles',
    'Automobiles',
    'Iron & Steel',
];

const COUNTRIES = [
    'USA',
    'China',
    'UAE',
    'Saudi Arabia',
    'Hong Kong',
    'Singapore',
    'Germany',
    'UK',
    'Japan',
    'South Korea',
];

const YEARS = Array.from({ length: 16 }, (_, i) => (2010 + i).toString());

export function FilterPanel({ isOpen, filters, onFilterChange, onReset }: FilterPanelProps) {
    const toggleSector = (sector: string) => {
        const newSectors = filters.sectors.includes(sector)
            ? filters.sectors.filter(s => s !== sector)
            : [...filters.sectors, sector];
        onFilterChange({ ...filters, sectors: newSectors });
    };

    const toggleCountry = (country: string) => {
        const newCountries = filters.countries.includes(country)
            ? filters.countries.filter(c => c !== country)
            : [...filters.countries, country];
        onFilterChange({ ...filters, countries: newCountries });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                >
                    <div className="p-5 bg-gradient-to-br from-white/95 via-orange-50/50 to-amber-50/50 backdrop-blur-md border-t border-b border-orange-200/50 space-y-4">
                        {/* Trade Type Toggle */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-2 block">Trade Type</label>
                            <div className="flex gap-2">
                                {(['both', 'imports', 'exports'] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => onFilterChange({ ...filters, tradeType: type })}
                                        className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                            filters.tradeType === type
                                                ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30'
                                                : 'bg-white/80 text-slate-600 border border-slate-200 hover:border-orange-300'
                                        }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Year Range */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-2 block">From Year</label>
                                <select
                                    value={filters.yearFrom}
                                    onChange={(e) => onFilterChange({ ...filters, yearFrom: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/90 border-2 border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 transition-all text-sm font-medium shadow-sm"
                                >
                                    {YEARS.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-2 block">To Year</label>
                                <select
                                    value={filters.yearTo}
                                    onChange={(e) => onFilterChange({ ...filters, yearTo: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/90 border-2 border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 transition-all text-sm font-medium shadow-sm"
                                >
                                    {YEARS.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sectors */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-2 block">
                                Sectors/Commodities {filters.sectors.length > 0 && `(${filters.sectors.length} selected)`}
                            </label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-white/50 rounded-xl border border-slate-200">
                                {SECTORS.map((sector) => (
                                    <button
                                        key={sector}
                                        onClick={() => toggleSector(sector)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                            filters.sectors.includes(sector)
                                                ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
                                        }`}
                                    >
                                        {filters.sectors.includes(sector) && <Check size={14} strokeWidth={3} />}
                                        <span className="truncate">{sector}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Countries */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-2 block">
                                Countries/Regions {filters.countries.length > 0 && `(${filters.countries.length} selected)`}
                            </label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-white/50 rounded-xl border border-slate-200">
                                {COUNTRIES.map((country) => (
                                    <button
                                        key={country}
                                        onClick={() => toggleCountry(country)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                            filters.countries.includes(country)
                                                ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
                                        }`}
                                    >
                                        {filters.countries.includes(country) && <Check size={14} strokeWidth={3} />}
                                        <span className="truncate">{country}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onReset}
                                className="w-full px-4 py-3 rounded-xl bg-white text-slate-600 border-2 border-slate-200 hover:border-orange-300 hover:text-orange-600 font-bold text-sm transition-all shadow-sm"
                            >
                                Reset Filters
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
