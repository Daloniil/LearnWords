export const isIOSDevice = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  // iPadOS desktop UA
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
};
