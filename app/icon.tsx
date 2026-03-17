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
          {/* Magnifying Glass Ring */}
          <circle cx="45" cy="45" r="30" stroke="white" strokeWidth="8" />
          {/* Magnifying Glass Handle */}
          <path d="M68 68L85 85" stroke="white" strokeWidth="8" strokeLinecap="round" />
          {/* Trend Line Arrow */}
          <path
            d="M25 55L45 35L60 45L85 20"
            stroke="url(#grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M70 20H85V35"
            stroke="url(#grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="grad" x1="25" y1="55" x2="85" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#a855f7" />
              <stop offset="1" stopColor="#f43f5e" />
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
