import { useCallback, useEffect, useRef, useState } from "react";
import {
  notify,
  supportsVibration,
  unlockAudio,
  vibrate,
  type NotifyKind,
} from "@/lib/notify";

type Options = {
  /** When true, the hook fires the "accepted" alert on mount. */
  autoAccept?: boolean;
  /** Repeat interval (ms) for the escalating alert loop. */
  repeatMs?: number;
  /** How many escalation steps before the loop stops on its own. */
  maxRepeats?: number;
};

export function useNotifications({
  autoAccept = false,
  repeatMs = 6000,
  maxRepeats = 5,
}: Options = {}) {
  const [soundOn, setSoundOn] = useState(true);
  const [hapticsOn, setHapticsOn] = useState(true);
  const [vibrationSupported] = useState(() => supportsVibration());
  const [lastAlert, setLastAlert] = useState<NotifyKind | null>(null);
  const [alertActive, setAlertActive] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);

  const firedAccept = useRef(false);
  const loopRef = useRef<number | null>(null);
  const countRef = useRef(0);
  const kindRef = useRef<NotifyKind>("arrived");
  const soundRef = useRef(soundOn);
  const hapticsRef = useRef(hapticsOn);

  soundRef.current = soundOn;
  hapticsRef.current = hapticsOn;

  const stopAlert = useCallback(() => {
    if (loopRef.current !== null) {
      window.clearInterval(loopRef.current);
      loopRef.current = null;
    }
    countRef.current = 0;
    setRepeatCount(0);
    setAlertActive(false);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(0);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const emit = useCallback((kind: NotifyKind, intensity: number) => {
    if (soundRef.current) {
      notify(kind, intensity);
    } else if (hapticsRef.current) {
      vibrate(kind, intensity);
    }
  }, []);

  /** Fires an alert and keeps repeating it, louder each time, until stopped. */
  const startAlert = useCallback(
    (kind: NotifyKind) => {
      if (loopRef.current !== null) {
        window.clearInterval(loopRef.current);
        loopRef.current = null;
      }

      kindRef.current = kind;
      countRef.current = 0;
      setLastAlert(kind);
      setRepeatCount(0);
      setAlertActive(true);
      emit(kind, 1);

      loopRef.current = window.setInterval(() => {
        countRef.current += 1;
        if (countRef.current > maxRepeats) {
          stopAlert();
          return;
        }
        const intensity = 1 + countRef.current * 0.25;
        setRepeatCount(countRef.current);
        emit(kindRef.current, intensity);
      }, repeatMs);
    },
    [emit, maxRepeats, repeatMs, stopAlert],
  );

  const fire = useCallback(
    (kind: NotifyKind) => {
      emit(kind, 1);
      setLastAlert(kind);
    },
    [emit],
  );

  // Unlock audio on the first user interaction (mobile autoplay policy).
  useEffect(() => {
    function unlock() {
      unlockAudio();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    }
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (!autoAccept || firedAccept.current) return;
    firedAccept.current = true;
    const id = window.setTimeout(() => startAlert("accepted"), 250);
    return () => window.clearTimeout(id);
  }, [autoAccept, startAlert]);

  useEffect(() => stopAlert, [stopAlert]);

  return {
    soundOn,
    setSoundOn,
    hapticsOn,
    setHapticsOn,
    vibrationSupported,
    lastAlert,
    alertActive,
    repeatCount,
    fire,
    startAlert,
    stopAlert,
  };
}

export default useNotifications;