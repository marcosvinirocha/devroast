"use client";

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  id: string;
}

export function ShareButton({ id }: ShareButtonProps) {
  const ogImageUrl = `/roast/${id}/opengraph`;

  return (
    <a href={ogImageUrl} target="_blank" rel="noopener noreferrer">
      <Button variant="secondary" size="sm">
        share
      </Button>
    </a>
  );
}
