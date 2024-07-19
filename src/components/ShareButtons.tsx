"use client"

import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaCopy } from 'react-icons/fa';
import { RiTwitterXLine } from 'react-icons/ri';
import { BiCheckDouble } from "react-icons/bi";

function ShareButtons() {
    const [copied, setCopied] = useState(false);
    const currentUrl = window.location.href;

    const platforms = [
        {
            icon: <FaFacebook className="w-6 h-6 hover:text-blue-500" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        },
        {
            icon: <RiTwitterXLine className="w-6 h-6 hover:text-blue-500" />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`,
        },
        {
            icon: <FaWhatsapp className="w-6 h-6 hover:text-green-500" />,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`,
        },
        /*{
            icon: <FaInstagram className="w-6 h-6 hover:text-pink-500" />,
            url: `https://www.instagram.com/`,
        },*/
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex space-x-2">
            {platforms.map((platform, i) => (
                <a
                    key={i}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-full"
                >
                    {platform.icon}
                </a>
            ))}
            <button onClick={copyToClipboard} className="px-3 py-2 rounded-full">
                {copied ? (
                    <BiCheckDouble className="w-6 h-6 text-green-500" />
                ) : (
                    <FaCopy className="w-6 h-6 hover:text-gray-500" />
                )}
            </button>
        </div>
    );
}

export default ShareButtons;
