import { ImageResponse } from "@takumi-rs/image-response";
import { notFound } from "next/navigation";
import { getRoastById } from "@/lib/roast";

export const runtime = "nodejs";

export const alt = "DevRoast - Code Roast Result";
export const contentType = "image/png";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const data = await getRoastById(id);

  if (!data || !data.roast) {
    return notFound();
  }

  const { score, roast, language, code } = data;
  const codeLines = code.split("\n").length;

  const verdictText = roast.verdict || "needs_review";
  const quote = roast.quote || "No roast available";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        backgroundColor: "#0A0A0A",
        padding: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#10B981",
          }}
        >
          {">"}
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#FAFAFA",
          }}
        >
          devroast
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: "#F59E0B",
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: 56,
            color: "#4B5563",
          }}
        >
          /10
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#EF4444",
          }}
        />
        <span
          style={{
            fontSize: 20,
            color: "#EF4444",
          }}
        >
          {verdictText}
        </span>
      </div>

      <span
        style={{
          fontSize: 16,
          color: "#4B5563",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        lang: {language} · {codeLines} lines
      </span>

      <span
        style={{
          fontSize: 22,
          color: "#FAFAFA",
          textAlign: "center",
          lineHeight: 1.5,
          fontStyle: "italic",
        }}
      >
        "{quote}"
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
      format: "png",
    },
  );
}
