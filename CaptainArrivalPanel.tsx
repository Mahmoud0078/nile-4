import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard, StarRating, type Profile } from "@/components/ProfileCard";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import { CheckCircle2, MapPin, Navigation, Phone, Star } from "lucide-react";

export const CAPTAIN_PROFILE: Profile = {
  name: "أحمد محمود",
  avatarUrl: "https://i.pravatar.cc/160?img=12",
  rating: 4.9,
  trips: 3842,
  subtitle: "تويوتا كورولا · أ ب ج 123",
  verified: true,
};

export const CLIENT_PROFILE: Profile = {
  name: "منى عبد الرحمن",
  avatarUrl: "https://i.pravatar.cc/160?img=45",
  rating: 4.7,
  trips: 218,
  subtitle: "نقطة الالتقاء A · مدينة نصر",
  verified: true,
};

function CaptainArrivalPanelBase({
  arrived,
  onConfirmArrival,
}: {
  arrived: boolean;
  onConfirmArrival: () => void;
}) {
  const [captainRating, setCaptainRating] = useState(0);
  const [clientRating, setClientRating] = useState(0);

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">قبول الطلب</p>
            <p className="text-[10px] font-medium text-slate-500">
              {arrived ? "تم تأكيد الوصول" : "في انتظار تأكيد الكابتن"}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-bold",
            arrived
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700",
          )}
        >
          {arrived ? "وصل" : "في الطريق"}
        </span>
      </div>

      <CardContent className="space-y-3 p-4">
        <ProfileCard role="captain" profile={CAPTAIN_PROFILE} />
        <ProfileCard role="client" profile={CLIENT_PROFILE} />

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 text-xs font-bold text-slate-700"
            onClick={() => hapticTap()}
          >
            <Phone className="ms-1 h-3.5 w-3.5" />
            اتصال
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 text-xs font-bold text-slate-700"
            onClick={() => hapticTap()}
          >
            <Navigation className="ms-1 h-3.5 w-3.5" />
            الملاحة
          </Button>
        </div>

        {!arrived ? (
          <Button
            className="h-11 w-full rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700"
            onClick={() => {
              hapticTap();
              onConfirmArrival();
            }}
          >
            <CheckCircle2 className="ms-1 h-4 w-4" />
            تأكيد الوصول للعميل
          </Button>
        ) : (
          <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-xs font-bold text-emerald-800">
                تم قبول الطلب — قيّم تجربتك
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-white p-2.5">
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-[11px] font-bold text-slate-700">
                    تقييم الكابتن
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`تقييم الكابتن ${i}`}
                      onClick={() => {
                        hapticTap();
                        setCaptainRating(i);
                      }}
                      className="transition active:scale-90"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          captainRating >= i
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white p-2.5">
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-[11px] font-bold text-slate-700">
                    تقييم العميل
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`تقييم العميل ${i}`}
                      onClick={() => {
                        hapticTap();
                        setClientRating(i);
                      }}
                      className="transition active:scale-90"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          clientRating >= i
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white p-2.5">
              <p className="text-[11px] font-bold text-slate-700">
                متوسط التقييم
              </p>
              <div className="flex items-center gap-2">
                <StarRating
                  value={(captainRating + clientRating) / 2}
                  size="md"
                />
                <span className="text-xs font-bold text-slate-900">
                  {((captainRating + clientRating) / 2).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const CaptainArrivalPanel = memo(CaptainArrivalPanelBase);
export default CaptainArrivalPanel;