import type { ElementType, HTMLAttributes } from "react";
import { escapeHtmlText } from "@/lib/html-text";

type LiteralTextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  text: string;
};

export function LiteralText({ as: Tag = "span", text, ...props }: LiteralTextProps) {
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: escapeHtmlText(text) }} />;
}
