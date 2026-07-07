"use client";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
};

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className="inline-flex items-center gap-3 text-sm text-texto"
    >
      <span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "bg-dourado" : "bg-rosa-bebe"}`}>
        <span className={`h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`} />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}
