"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TooltipProps = {
    children: React.ReactNode;
    content: string;
    delay?: number;
    disabled?: boolean;
};

export function Tooltip({ children, content, delay = 300, disabled = false }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    let timeoutId: NodeJS.Timeout;

    const handleMouseEnter = () => {
        if (disabled) return;
        timeoutId = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutId);
        setIsVisible(false);
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute bottom-full right-0 mb-2 z-50 pointer-events-none"
                    >
                        {/* Tooltip content with gradient */}
                        <div className="relative px-4 py-2.5 rounded-xl bg-linear-to-r from-orange-400 via-amber-400 to-pink-400 shadow-lg shadow-orange-500/40">
                            <p className="text-white text-xs font-bold whitespace-nowrap">
                                {content}
                            </p>
                            {/* Arrow */}
                            <div className="absolute top-full right-4 -mt-0.5">
                                <div className="w-3 h-3 bg-linear-to-br from-orange-400 to-pink-400 rotate-45" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
