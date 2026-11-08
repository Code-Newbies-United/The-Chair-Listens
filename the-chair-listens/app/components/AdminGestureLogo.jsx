import { useRef } from "react";
import { useRouter } from "next/router";

export const TAPS_REQUIRED = 5;
export const TAP_WINDOW_MS = 3000;

export default function AdminGestureLogo({ style, ...imgProps }) {
  const router = useRouter();
  const taps = useRef([]);

  function handleClick() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < TAP_WINDOW_MS), now];
    if (taps.current.length >= TAPS_REQUIRED) {
      taps.current = [];
      router.push("/admin/login");
    }
  }

  return (
    <img
      {...imgProps}
      alt={imgProps.alt || ""}
      onClick={handleClick}
      draggable={false}
      style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent", ...style }}
    />
  );
}
