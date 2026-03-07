type Status = "gozlemede" | "baxilir" | "tesdiq_edildi" | "red_edildi";

const CONFIG: Record<Status, { label: string; className: string }> = {
  gozlemede: {
    label: "Gözlənilir",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  baxilir: {
    label: "Baxılır",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  tesdiq_edildi: {
    label: "Təsdiq edildi",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  red_edildi: {
    label: "Rədd edildi",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, className } = CONFIG[status] ?? CONFIG.gozlemede;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${className}`}
    >
      {label}
    </span>
  );
}
