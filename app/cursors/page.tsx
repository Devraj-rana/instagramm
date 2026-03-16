"use client";

import React, { useState } from 'react';
import CustomCursor from '@/components/modern/CustomCursor';

const cursorOptions = [
  { id: 'default', name: 'Default Ring' },
  { id: 'dot', name: 'Simple Dot' },
  { id: 'fancy', name: 'Fancy Trail' },
];

const CursorShowcasePage = () => {
  const [cursorStyle, setCursorStyle] = useState('default');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Cursor Showcase</h1>
      <p className="text-zinc-400 mb-12 max-w-2xl text-center">
        Hover over the buttons to see the different cursor styles. The active cursor style will be applied across the application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {cursorOptions.map((option) => (
          <div
            key={option.id}
            className="p-8 rounded-lg bg-surface border border-border-subtle hover:border-border-accent transition-all duration-300"
            onMouseEnter={() => setCursorStyle(option.id)}
          >
            <h2 className="text-2xl font-bold mb-2">{option.name}</h2>
            <p className="text-zinc-400">
              This is a demonstration of the "{option.name}" cursor style. Move your mouse around this box to see it in action.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
          <p className="text-zinc-400">Current active style: <span className="font-bold text-white">{cursorStyle}</span></p>
      </div>

      {/* This is where the actual cursor component will be rendered with the selected style */}
      {/* For now, it's a placeholder until we modify the CustomCursor component */}
      {/* <CustomCursor style={cursorStyle} /> */}
    </div>
  );
};

export default CursorShowcasePage;
