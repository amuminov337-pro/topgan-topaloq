// Brend belgisi: oltin rangdagi lampochka — "topildi!" lahzasining ramzi.
// Boshqa sahifalarda ham ishlatiladi, shuning uchun o'lchami prop orqali beriladi.

export default function Logotip({ olcham = 72 }: { olcham?: number }) {
  return (
    <svg
      width={olcham}
      height={olcham}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Topgan-topaloq logotipi"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* nur chiziqlari */}
      <g stroke="#E0A63E" strokeWidth="3" strokeLinecap="round" opacity="0.85">
        <line x1="32" y1="3" x2="32" y2="10" />
        <line x1="12.5" y1="11.5" x2="17.5" y2="16.5" />
        <line x1="51.5" y1="11.5" x2="46.5" y2="16.5" />
        <line x1="4" y1="31" x2="11" y2="31" />
        <line x1="60" y1="31" x2="53" y2="31" />
      </g>

      {/* lampochka gumbazi */}
      <path
        d="M32 13c-9.4 0-17 7.4-17 16.5 0 6 3.1 10.4 6.4 13.6 1.6 1.6 2.6 3.3 2.6 5.2v1.2h16v-1.2c0-1.9 1-3.6 2.6-5.2 3.3-3.2 6.4-7.6 6.4-13.6C49 20.4 41.4 13 32 13z"
        fill="#E0A63E"
      />

      {/* ichki yorug'lik */}
      <path
        d="M32 21c-4.7 0-8.5 3.7-8.5 8.3 0 2.6 1.2 4.6 2.7 6.2"
        stroke="#FBEFDA"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* tsokol */}
      <rect x="24" y="51" width="16" height="4" rx="2" fill="#1E2A57" />
      <rect x="26" y="57" width="12" height="4" rx="2" fill="#1E2A57" />
    </svg>
  );
}
