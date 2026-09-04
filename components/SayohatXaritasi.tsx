// F14 (qayta ishlangan versiya) — "Hikmat yo'li" xaritasining o'zi: eski
// qog'oz (parxament) uslubidagi fon ustida burama yo'l, bekatlar va joriy
// bekatda turgan "sayohatchi" (karvon) belgisi. Hali yetib borilmagan
// bekatlar sirli "?" bilan ko'rsatiladi — bu keyingi manzilni oldindan
// oshkor qilmaslik uchun ataylab shunday (kutish va kashfiyot hissi uchun).
// Bosqich o'zgarganda belgi CSS transition bilan yumshoq siljiydi.
"use client";

import { MANZILLAR } from "@/lib/manzillar";

type Props = {
  joriyBosqich: number;
  /** true bo'lsa, joriy bekat atrofida "yangi ochildi" porlash effekti ko'rsatiladi. */
  yangiBekatMi?: boolean;
};

export default function SayohatXaritasi({ joriyBosqich, yangiBekatMi = false }: Props) {
  const joriy = MANZILLAR[joriyBosqich];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border-4"
      style={{
        aspectRatio: "100 / 146",
        borderColor: "#d8c9a3",
        background: "linear-gradient(160deg, #f6efdb 0%, #ecdfba 55%, #efe1bf 100%)",
        boxShadow: "inset 0 0 30px rgba(169,118,31,0.15)",
      }}
    >
      <span className="absolute right-3 top-3 text-2xl opacity-40" aria-hidden>
        🧭
      </span>

      <svg
        viewBox="0 0 100 146"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <polyline
          points={MANZILLAR.map((m) => `${m.x},${m.y}`).join(" ")}
          fill="none"
          stroke="#a9761f"
          strokeWidth="1"
          strokeDasharray="2.5 2"
          strokeLinecap="round"
          opacity={0.55}
        />
      </svg>

      {MANZILLAR.map((manzil, i) => {
        const ochilgan = i <= joriyBosqich;
        return (
          <div
            key={manzil.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${manzil.x}%`, top: `${manzil.y}%` }}
          >
            {i === joriyBosqich && yangiBekatMi && (
              <span className="absolute h-8 w-8 animate-ping rounded-full bg-oltin/50" />
            )}
            <span
              className={
                "relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm shadow-sm transition " +
                (ochilgan ? "border-oltin bg-white" : "border-[#c9b98c] bg-[#e9dcb8] text-[#a99a72]")
              }
            >
              {ochilgan ? manzil.ikonka : "?"}
            </span>
            {ochilgan && (
              <span className="mt-1 whitespace-nowrap rounded-full bg-white/85 px-1.5 py-0.5 text-[8px] font-bold text-brend shadow-sm">
                {manzil.nomi}
              </span>
            )}
          </div>
        );
      })}

      <div
        className="absolute -translate-x-1/2 text-2xl transition-all duration-700 ease-out"
        style={{ left: `${joriy.x}%`, top: `${joriy.y}%`, transform: "translate(-50%, -170%)" }}
        aria-hidden
      >
        🐫
      </div>
    </div>
  );
}
