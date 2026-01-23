"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HeroGeometricProps {
    badge?: string;
    title1: string;
    title2: string;
    description: string;
    children?: ReactNode;
}

export function HeroGeometric({
    badge,
    title1,
    title2,
    description,
    children,
}: HeroGeometricProps) {
    return (
        <div className="hero-geometric">
            {/* Animated Background Shapes */}
            <div className="hero-geometric-bg">
                {/* Large floating shapes */}
                <motion.div
                    className="hero-shape hero-shape-1"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="hero-shape hero-shape-2"
                    animate={{
                        x: [0, -25, 0],
                        y: [0, 15, 0],
                        rotate: [0, -3, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="hero-shape hero-shape-3"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, 25, 0],
                        rotate: [0, 8, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="hero-shape hero-shape-4"
                    animate={{
                        x: [0, -15, 0],
                        y: [0, -30, 0],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Content */}
            <div className="hero-geometric-content">
                <div className="hero-content-wrapper">
                    {badge && (
                        <motion.div
                            className="hero-badge"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="hero-badge-dot"></span>
                            {badge}
                        </motion.div>
                    )}

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="hero-title-line">{title1}</span>
                        <span className="hero-title-line hero-title-gradient">{title2}</span>
                    </motion.h1>

                    <motion.p
                        className="hero-description"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {description}
                    </motion.p>
                </div>

                {children && (
                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {children}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
