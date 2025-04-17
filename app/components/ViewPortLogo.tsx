'use client';

interface ViewPortLogoProps {
  className?: string;
}

export default function ViewPortLogo({ className = "w-10 h-10" }: ViewPortLogoProps) {

  const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  return (
    <div className="flex items-center gap-3">
      <svg
        className={className}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle with gradient */}
        <circle
          cx="16"
          cy="16"
          r="14"
          className="fill-purple-900"
        />

        {/* Outer ring with glow */}
        <circle
          cx="16"
          cy="16"
          r="13"
          strokeWidth="1"
          className="stroke-purple-400"
          filter="url(#glowRing)"
        />

        {/* Dynamic portal shape */}
        <path
          d="M16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-purple-400"
          filter="url(#glowPath)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 16 16"
            to="360 16 16"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>

        {/* Central play button */}
        <path
          d="M14 12L20 16L14 20V12Z"
          className="fill-purple-300"
          filter="url(#glowCenter)"
        >
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Sparkle effects */}
        <circle cx="10" cy="16" r="1" className="fill-purple-300">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="22" cy="16" r="1" className="fill-purple-300">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1.5s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Enhanced glow effects */}
        <defs>
          <filter id="glowRing" x="-2" y="-2" width="36" height="36">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="#C084FC" floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowPath" x="-2" y="-2" width="36" height="36">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="#A855F7" floodOpacity="0.6" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowCenter" x="-2" y="-2" width="36" height="36">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="#E9D5FF" floodOpacity="0.7" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <span className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-purple-500 to-purple-400 bg-clip-text text-transparent">
        ViewPort
      </span>
    </div>
  );
} 