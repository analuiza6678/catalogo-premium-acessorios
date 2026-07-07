type StatsCardProps = {
  label: string;
  value: number | string;
  hint?: string;
  icon?: React.ReactNode;
};

export function StatsCard({ label, value, hint, icon }: StatsCardProps) {
  return (
    <div className="rounded-[26px] border border-[#C9A24D]/16 bg-white/70 p-5 shadow-[0_18px_50px_rgba(80,55,25,0.07)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(80,55,25,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A87921]">{label}</p>
          <strong className="mt-3 block font-serif text-4xl font-normal leading-none text-[#1E1D1B]">{value}</strong>
        </div>
        {icon ? <span className="grid size-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#F4D892,#D7AE4A)] text-[#4A3320] shadow-[0_12px_28px_rgba(168,121,33,0.16)]">{icon}</span> : null}
      </div>
      {hint ? <p className="mt-4 text-sm leading-6 text-[#6F6258]">{hint}</p> : null}
    </div>
  );
}
