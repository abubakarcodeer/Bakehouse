import { parseRichText } from "../../lib/product";

// Renders long-form text: blank line = new paragraph, "- " lines = bullet list.
export default function RichText({ text, className = "" }) {
  return (
    <div className={`space-y-3 text-sm leading-relaxed text-muted ${className}`}>
      {parseRichText(text).map((block, i) =>
        block.type === "list" ? (
          <ul key={i} className="space-y-1.5">
            {block.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-honey" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>{block.text}</p>
        )
      )}
    </div>
  );
}
