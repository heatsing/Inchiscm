"use client";

import { useState } from "react";

export function HeightResultActions({
  copyText,
  shareUrl,
  shareTitle,
  shareText,
}: {
  copyText: string;
  shareUrl: string;
  shareTitle: string;
  shareText: string;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  async function share() {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("copied");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("error");
    }
    window.setTimeout(() => setShareStatus("idle"), 1800);
  }

  return (
    <div className="height-result-actions">
      <button className="copy-button" type="button" onClick={copy}>
        {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Unable to copy" : "Copy result"}
      </button>
      <button className="button" type="button" onClick={share}>
        {shareStatus === "shared" ? "Shared" : shareStatus === "copied" ? "Link copied" : shareStatus === "error" ? "Unable to share" : "Share"}
      </button>
    </div>
  );
}
