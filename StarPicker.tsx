import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { ratingLabel } from "@/lib/ratings";

type Props = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export function StarPicker({ value, onChange, className }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= value;
          return (
            <button
              key={star}
              type="button"
              aria-label={`${star} نجوم`}
              onClick={() => onChange(star)}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition active:scale-95",
                active
                  ? "border-amber-300 bg-amber-100 text-amber-500 shadow-sm"
                  : "border-slate-200 bg-white text-slate-300 hover:border-amber-200 hover:text-amber-400",
              )}
            >
              <Star
                className="h-5 w-5"
                fill={active ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>
      <p
        className={cn(
          "text-center text-xs font-semibold",
          value > 0 ? "text-amber-700" : "text-slate-400",
        )}
      >
        {ratingLabel(value)}
      </p>
    </div>
  );
}

export default StarPicker;