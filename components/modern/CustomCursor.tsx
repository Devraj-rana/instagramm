"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import MouseFollower from "mouse-follower";
import "mouse-follower/dist/mouse-follower.min.css";

MouseFollower.registerGSAP(gsap);

export default function CustomCursor() {
    const pathname = usePathname();

    useEffect(() => {
        // Hide cursor on analyze page if you still want that behavior
        if (pathname.includes("/analyze")) {
            document.body.classList.remove("mf-cursor-active");
            return;
        }

        const cursor = new MouseFollower({
            container: document.body,
            speed: 0.5,
            ease: "expo.out",
            overwrite: true,
            skewing: 1, // beautiful skew trail
            skewingText: 2,
            skewingIcon: 2,
            skewingMedia: 2,
            skewingImage: 2,
            stickDelta: 0.15,
            className: "mf-cursor",
            innerClassName: "mf-cursor-inner",
            textClassName: "mf-cursor-text",
            mediaClassName: "mf-cursor-media",
            mediaBoxClassName: "mf-cursor-media-box",
            iconSvgClassName: "mf-svgsprite",
            iconSvgNamePrefix: "-",
            iconSvgSrc: "", // If you want to load custom SVGs later
            dataAttr: "cursor",
            hiddenState: "-hidden",
            textState: "-text",
            iconState: "-icon",
            activeState: "-active",
            mediaState: "-media",
            stateDetection: {
                "-pointer": "a,button",
                "-hidden": "iframe"
            },
            visible: true,
            visibleOnState: false,
        });

        // Add a nice custom global override just for some Awwwards aesthetic       
        // to invert the cursor color against dark/light backgrounds automatically  
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                cursor: none; /* Hide default cursor everywhere */
            }
            a, button, input {
                cursor: none; /* Hide default cursor on interactive elements */
            }
            .mf-cursor {
                mix-blend-mode: difference;
                z-index: 99999;
            }
            .mf-cursor:before {
                /* Awwwards standard: decent sized solid circle */
                transform: scale(1);
                background-color: white;
                transition: transform 0.3s ease;
            }
            .mf-cursor.-pointer:before {
                /* Shrink into a small focused dot when hovering over a link/button */
                transform: scale(0.3) !important;
            }
            .mf-cursor.-active:before {
                transform: scale(1.5);
            }
            .mf-cursor.-text:before {
                opacity: 0.8 !important;
                transform: scale(2.5) !important;
            }
            .mf-cursor-text {
                font-weight: 700;
                font-family: var(--font-sans);
                text-transform: uppercase;
                letter-spacing: 1px;
            }
        `;
        document.head.appendChild(style);

        return () => {
            cursor.destroy();
            if (document.head.contains(style)) document.head.removeChild(style);    
        };
    }, [pathname]);

    return null; // MouseFollower creates dom elements automatically
}
