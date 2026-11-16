import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RequestBroadcast } from "@/components/RequestBroadcast";
import { ActiveTrip } from "@/components/ActiveTrip";
import { TripChat } from "@/components/TripChat";
import { cn } from "@/lib/utils";
import { demoCaptain } from "@/lib/chat";
import { demoRequests, type TripRequest } from "@/lib/requests";
import { Car, MessageSquare, Radio } from "lucide-react";

type Tab = "requests" | "chat";

export function CaptainConsole() {
  const [requests, setRequests] = useState<TripRequest[]>(() => demoRequests);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("requests");

  const activeRequest = useMemo(
    () => requests.find((r) => r.id === activeId) ?? null,
    [requests, activeId],
  );

  const openRequests = useMemo(
    () => requests.filter((r) => r.status === "open"),
    [requests],
  );

  function accept(id: string) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "accepted", acceptedBy: demoCaptain.name }
          : r,
      ),
    );
    setActiveId(id);
    setTab("requests");
  }

  function complete() {
    setRequests((prev) => prev.filter((r) => r.id !== activeId));
    setActiveId(null);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("requests")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
            tab === "requests"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50",
          )}
        >
          <Radio className="h-4 w-4" />
          {activeRequest ? "رحلتي" : "الطلبات"}
        </button>
        <button
          type="button"
          onClick={() => setTab("chat")}
          disabled={!activeRequest}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
            tab === "chat"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50",
            !activeRequest && "cursor-not-allowed opacity-40 hover:bg-transparent",
          )}
        >
          <MessageSquare className="h-4 w-4" />
          المحادثة
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === "chat" && activeRequest ? (
          <div className="h-full">
            <TripChat role="captain" />
          </div>
        ) : activeRequest ? (
          <ActiveTrip request={activeRequest} onComplete={complete} />
        ) : (
          <RequestBroadcast
            requests={openRequests}
            onAccept={accept}
            captainName={demoCaptain.name}
          />
        )}
      </div>
    </div>
  );
}

export default CaptainConsole;