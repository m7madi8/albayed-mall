import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NATURAL_DURATION, VIEWBOX } from "./geometry";
import { buildLoaderHtml, LOADER_MESSAGE_SOURCE, type LoaderMessage } from "./html";
import type { MallLogoLoaderProps } from "./types";

/** Grace period after the expected end before we give up waiting for the document. */
const FALLBACK_GRACE_MS = 2000;

export function useLoaderDocument({
  duration = NATURAL_DURATION,
  delay = 0,
  size = 360,
  onComplete,
  colors,
  label = "AL BAYED",
}: MallLogoLoaderProps) {
  const accent = colors?.accent ?? "#FFBE29";
  const dark = colors?.dark ?? "#3A3A3A";
  const [ready, setReady] = useState(false);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const html = useMemo(
    () => buildLoaderHtml({ duration, delay, accent, dark, label }),
    [duration, delay, accent, dark, label]
  );

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    doneRef.current = false;
    const timer = setTimeout(finish, (delay + duration) * 1000 + FALLBACK_GRACE_MS);
    return () => clearTimeout(timer);
  }, [html, delay, duration, finish]);

  const handleMessage = useCallback(
    (raw: unknown) => {
      if (typeof raw !== "string") return;
      let message: LoaderMessage;
      try {
        message = JSON.parse(raw);
      } catch {
        return;
      }
      if (message?.source !== LOADER_MESSAGE_SOURCE) return;
      if (message.type === "ready") setReady(true);
      if (message.type === "complete") finish();
    },
    [finish]
  );

  return {
    html,
    ready,
    handleMessage,
    width: size,
    height: Math.round((size * VIEWBOX.height) / VIEWBOX.width),
    label,
  };
}
