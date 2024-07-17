"use client"

import { useScroll, useTransform, motion } from 'framer-motion';
import React, { useRef } from 'react';

interface TextRevealOnScrollProps {
    text: string;
    fontSize?: string;
}

const TextRevealOnScroll: React.FC<TextRevealOnScrollProps> = ({
    text,
    fontSize = '60px',
}) => {
    const container = useRef<HTMLParagraphElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0", "start 0.5"],
    });

    const characters = text.split(" ");

    return (
        <p ref={container} className={`flex text-${fontSize} leading-none max-w-[1280px] flex-wrap relative`}>
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    style={{
                        display: 'inline-block',
                        overflow: 'hidden',
                        whiteSpace: 'pre',
                        opacity: 0,
                        y: 10,
                    }}
                    className=' mr-1'
                    animate={{ opacity: 1, y:0 }}
                    transition={{ delay: index * 0.05,type: "spring", stiffness: 500 }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </p>
    );
};

export default TextRevealOnScroll;