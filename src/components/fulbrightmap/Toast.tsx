import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type ToastMessage = {
  id: number;
  tone: "success" | "error" | "info" | "warning";
  title: string;
  detail?: string;
};

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const TONES = {
  success: "border-white/20 bg-neutral-950/80 text-white",
  error: "border-white/20 bg-neutral-950/80 text-white",
  info: "border-white/20 bg-neutral-950/75 text-white",
  warning: "border-white/20 bg-neutral-950/80 text-white",
};

export default function Toast({
  toast,
  onClose,
}: {
  toast: ToastMessage | null;
  onClose: () => void;
}) {
  if (!toast) return null;

  const Icon = ICONS[toast.tone] ?? Info;
  const toneClass = TONES[toast.tone] ?? TONES.info;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[80] flex justify-center sm:top-6">
      <div
        role="status"
        className={[
          "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl",
          toneClass,
        ].join(" ")}
      >
        <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{toast.title}</div>
          {toast.detail ? (
            <div className="mt-0.5 text-sm opacity-80">{toast.detail}</div>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onClose}
          className="rounded-full p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
