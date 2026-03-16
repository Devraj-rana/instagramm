"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Hide cursor on analyze page for better UX
    if (pathname.includes('/analyze')) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      if (followerRef.current) followerRef.current.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    } else {
      if (cursorRef.current) cursorRef.current.style.display = 'block';
      if (followerRef.current) followerRef.current.style.display = 'block';
      document.body.style.cursor = 'none';
    }

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    gsap.to({}, {
      repeat: -1,
      duration: 0.016,
      onRepeat: () => {
        if (cursorRef.current && followerRef.current) {
          posX += (mouseX - posX) / 9;
          posY += (mouseY - posY) / 9;

          gsap.set(followerRef.current, {
            left: posX - 12,
            top: posY - 12,
          });

          gsap.set(cursorRef.current, {
            left: mouseX - 5,
            top: mouseY - 5,
          });
        }
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1.5, duration: 0.3 });
      }
      if (followerRef.current) {
        gsap.to(followerRef.current, { scale: 1.3, duration: 0.3 });
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
      }
      if (followerRef.current) {
        gsap.to(followerRef.current, { scale: 1, duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.querySelectorAll('a, button, input[type="submit"], input[type="button"], [data-cursor-pointer]').forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('a, button, input[type="submit"], input[type="button"], [data-cursor-pointer]').forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
      // Reset body cursor style
      document.body.style.cursor = 'auto';
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor fixed w-3 h-3 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'scale(1)' }}
      />
      <div
        ref={followerRef}
        className="custom-cursor-follower fixed w-6 h-6 rounded-full border border-white pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'scale(1)' }}
      />
    </>
  );
};

export default CustomCursor;
