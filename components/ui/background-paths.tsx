"use client";

import { motion } from "framer-motion";

interface BackgroundPathsProps {
    title?: string;
}

export function BackgroundPaths({ title }: BackgroundPathsProps) {
    // Complex curved paths matching shadcn's elegant design
    const paths = [
        {
            d: "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
            duration: 20,
            delay: 0,
            opacity: [0.15, 0.4, 0.15],
            strokeWidth: 1,
        },
        {
            d: "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
            duration: 25,
            delay: 2,
            opacity: [0.1, 0.3, 0.1],
            strokeWidth: 1.5,
        },
        {
            d: "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
            duration: 18,
            delay: 1,
            opacity: [0.2, 0.5, 0.2],
            strokeWidth: 1,
        },
        {
            d: "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
            duration: 22,
            delay: 3,
            opacity: [0.12, 0.35, 0.12],
            strokeWidth: 1.2,
        },
        {
            d: "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
            duration: 28,
            delay: 1.5,
            opacity: [0.18, 0.45, 0.18],
            strokeWidth: 1,
        },
        {
            d: "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
            duration: 24,
            delay: 0.5,
            opacity: [0.08, 0.25, 0.08],
            strokeWidth: 1.3,
        },
    ];

    // Floating blob shapes like shadcn
    const blobs = [
        { size: 400, x: "10%", y: "20%", duration: 25, delay: 0, color: "rgba(99, 102, 241, 0.15)" },
        { size: 350, x: "80%", y: "10%", duration: 30, delay: 2, color: "rgba(168, 85, 247, 0.12)" },
        { size: 300, x: "70%", y: "70%", duration: 28, delay: 1, color: "rgba(139, 92, 246, 0.1)" },
        { size: 250, x: "20%", y: "80%", duration: 22, delay: 3, color: "rgba(124, 58, 237, 0.08)" },
    ];

    return (
        <div className="background-paths-container">
            {/* Floating Blobs */}
            {blobs.map((blob, index) => (
                <motion.div
                    key={`blob-${index}`}
                    className="background-blob"
                    style={{
                        width: blob.size,
                        height: blob.size,
                        left: blob.x,
                        top: blob.y,
                        background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
                    }}
                    animate={{
                        x: [-30, 30, -30],
                        y: [-20, 20, -20],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: blob.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: blob.delay,
                    }}
                />
            ))}

            {/* Animated SVG Paths */}
            <svg
                className="background-paths-svg"
                viewBox="0 0 696 316"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
            >
                {paths.map((path, index) => (
                    <motion.path
                        key={index}
                        d={path.d}
                        stroke="url(#gradient)"
                        strokeWidth={path.strokeWidth}
                        strokeLinecap="round"
                        fill="none"
                        initial={{ opacity: path.opacity[0], y: -15 }}
                        animate={{
                            y: [-15, 15, -15],
                            opacity: path.opacity,
                        }}
                        transition={{
                            duration: path.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: path.delay,
                        }}
                    />
                ))}

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                        <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0.2)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Subtle gradient overlay */}
            <div className="background-paths-overlay"></div>
        </div>
    );
}
