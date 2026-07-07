type DashboardHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
};

export function DashboardHeader({ title, description, eyebrow = "Painel administrativo", action }: DashboardHeaderProps) {
  return (
    <div className="mb-7 overflow-hidden rounded-[32px] border border-[#C9A24D]/18 bg-white/62 p-6 shadow-[0_24px_70px_rgba(80,55,25,0.08)] backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9A24D]">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-[clamp(42px,5vw,72px)] font-normal leading-[0.96] tracking-[-0.035em] text-[#1E1D1B]">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6F6258] sm:text-base">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
