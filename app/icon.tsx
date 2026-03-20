import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: '#0F0F11',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Inner Pulse Point */}
          <circle cx="50" cy="50" r="12" fill="url(#grad)" />
          
          {/* Outer Focus Rings / Arcs */}
          <path
            d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50"
            stroke="url(#grad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Decorative Accents */}
          <circle cx="50" cy="50" r="35" stroke="white" strokeOpacity="0.1" strokeWidth="2" />

          <defs>
            <linearGradient id="grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#a855f7" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
