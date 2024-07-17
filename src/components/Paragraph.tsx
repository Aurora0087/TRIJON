"use client"

import { useScroll, useTransform, motion } from 'framer-motion';
import React, { useRef, FC } from 'react';

interface ParagraphProps {
    paragraph: string;
}

interface WordProps {
    children: string;
    progress: any;
    range: number[];
}

interface CharProps {
    children: string;
    progress: any;
    range: number[];
}

const Char: FC<CharProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, [range[0], range[1]], [0, 1]);
    return (
        <span className="relative inline-block">
            <span className="absolute opacity-20">{children}</span>
            <motion.span style={{ opacity }}>{children}</motion.span>
        </span>
    );
};

const Word: FC<WordProps> = ({ children, progress, range }) => {
    const amount = range[1] - range[0];
    const step = amount / children.length;
    return (
        <span className="relative mr-3 mt-3 inline-block">
            {children.split("").map((char, i) => {
                const start = range[0] + (i * step);
                const end = start + step;
                return (
                    <Char key={`c_${i}`} progress={progress} range={[start, end]}>
                        {char}
                    </Char>
                );
            })}
        </span>
    );
};

const Paragraph: FC<ParagraphProps> = ({ paragraph }) => {
    const container = useRef<HTMLParagraphElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0.2", "start 0.18"],
    });

    const words = paragraph.split(" ");
    return (
        <p ref={container} className="flex leading-none p-10 max-w-[1280px] text-black flex-wrap">
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                    <Word key={i} progress={scrollYProgress} range={[start, end]}>
                        {word}
                    </Word>
                );
            })}
        </p>
    );
};

export default Paragraph;
