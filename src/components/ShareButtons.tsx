"use client"

import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { RiTwitterXFill, RiTwitterXLine } from 'react-icons/ri';

function ShareButtons() {
    const currentUrl = window.location.href;

    const platforms = [
        {
            icon: <FaFacebook className="w-6 h-6 hover:text-blue-500"/>,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        },
        {
            icon: <RiTwitterXLine className="w-6 h-6 hover:text-blue-500" />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`,
        },
        {
            icon: <FaWhatsapp  className="w-6 h-6 hover:text-green-500"/>,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`,
        },
    ];

    return (
        <div className="flex space-x-2">
            {platforms.map((platform,i) => (
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
        </div>
    );
}

export default ShareButtons;
