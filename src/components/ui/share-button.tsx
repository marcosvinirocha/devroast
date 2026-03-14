"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  id: string;
  score: number;
}

export function ShareButton({ id, score }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const ogImageUrl = `${window.location.origin}/roast/${id}/opengraph`;

    try {
      await navigator.clipboard.writeText(ogImageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = ogImageUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleShare}>
      {copied ? `copied! score: ${score}` : "share"}
    </Button>
  );
}
