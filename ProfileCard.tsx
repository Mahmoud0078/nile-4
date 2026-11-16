import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export type ProfileRole = "captain" | "client";

export type Profile = {
  name: string;
  /** Remote or data-URI image; falls back to initials when absent/broken. */
  avatarUrl?: string;
  rating: number;
  trips: number;
  /** Short descriptor, e.g. "تويوتا كورولا · أ ب ج 123". */
  subtitle?: string;
  verified?: boolean;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0)).join("");
}

export function StarRating({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(value * 2) / 2;
  const dim = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-0.5" aria-label={`التقييم ${value}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rounded >= i;
        const half = !filled && rounded >= i - 0.5;
        return (
          <span key={i} className="relative inline-flex">
            <Star className={cn(dim, "text-slate-300")} />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? "50%" : "100%" }}
              >
                <Star className={cn(dim, "fill-amber-400 text-amber-400")} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function ProfileCardBase({
  role,
  profile,
  className,
}: {
  role: ProfileRole;
  profile: Profile;
  className?: string;
}) {
  const isCaptain = role === "captain";
  const accent = isCaptain ? "bg-teal-600" : "bg-amber-500";
  const ring = isCaptain ? "ring-teal-100" : "ring-amber-100";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3",
        className,
      )}
    >
      <Avatar className={cn("h-12 w-12 shrink-0 ring-4", ring)}>
        {profile.avatarUrl ? (
          <AvatarImage src={profile.avatarUrl} alt={profile.name} />
        ) : null}
        <AvatarFallback
          className={cn(
            "text-sm font-bold text-white",
            isCaptain ? "bg-teal-600" : "bg-amber-500",
          )}
        >
          {initials(profile.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold text-slate-900">
            {profile.name}
          </p>
          {profile.verified ? (
            <Badge
              className={cn(
                "shrink-0 rounded-full border-0 px-1.5 py-0 text-[9px] font-bold text-white",
                accent,
              )}
            >
              موثّق
            </Badge>
          ) : null}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <StarRating value={profile.rating} />
          <span className="text-[11px] font-bold text-slate-700">
            {profile.rating.toFixed(1)}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            · {profile.trips.toLocaleString("en-US")} رحلة
          </span>
        </div>

        {profile.subtitle ? (
          <p className="mt-1 truncate text-[10px] font-medium text-slate-500">
            {profile.subtitle}
          </p>
        ) : null}
      </div>

      <span
        className={cn(
          "shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold",
          isCaptain
            ? "bg-teal-50 text-teal-700"
            : "bg-amber-50 text-amber-700",
        )}
      >
        {isCaptain ? "الكابتن" : "العميل"}
      </span>
    </div>
  );
}

export const ProfileCard = memo(ProfileCardBase);
export default ProfileCard;