// Bosh sahifadagi yashil natijalar paneli: nechta topishmoq yechilgani va
// so'nggi topilgan javoblar chiplari. F1 da statik prop bilan ishlaydi,
// F8 da localStorage'dan to'ldiriladi.

type Props = {
  soni: number;
  songgiJavoblar: { belgi: string; nom: string }[];
};

export default function NatijaPanel({ soni, songgiJavoblar }: Props) {
  return (
    <section className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          🏆
        </span>
        <div className="leading-tight">
          <div className="text-3xl font-extrabold tabular-nums">{soni}</div>
          <div className="text-sm font-semibold opacity-80">
            topishmoq yechilgan
          </div>
        </div>
      </div>

      {songgiJavoblar.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {songgiJavoblar.map((j) => (
            <span
              key={j.nom}
              className="rounded-full border border-natija-matn/15 bg-white/70 px-3 py-1 text-sm font-semibold"
            >
              <span aria-hidden>{j.belgi}</span> {j.nom}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
