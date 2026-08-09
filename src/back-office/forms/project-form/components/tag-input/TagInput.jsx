import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTags } from "@fortawesome/free-solid-svg-icons";

// A chip's category prefix is painted with the colour for its category, passed
// down as the `--c` custom property. `default` was indigo, the accent this form
// no longer uses; it is now the same green as everything else affirmative.
const CATEGORY_COLORS = {
  status: "#3b82f6",
  priority: "#f59e0b",
  department: "#10b981",
  default: "#2ac17f",
};

const TagInput = ({
  tags,
  setTags,
  label = "Tags",
  maxTags = 8,
  maxTagLength = 20,
}) => {
  const [value, setValue] = useState("");
  const [warning, setWarning] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [over, setOver] = useState(null); // { type: 'gap' | 'merge', index }
  const SEP = /[,;./&]+/;
  const inputRef = useRef(null);
  const warnTimer = useRef(null);

  const flash = (msg) => {
    setWarning(msg);
    clearTimeout(warnTimer.current);
    warnTimer.current = setTimeout(() => setWarning(""), 2500);
  };

  const parseCategory = (tag) => {
    const [cat, ...rest] = tag.split(":");
    if (!rest.length) return { text: tag };
    return {
      cat,
      text: rest.join(":").trim(),
      color: CATEGORY_COLORS[cat.toLowerCase()] || CATEGORY_COLORS.default,
    };
  };

  const addTags = (raw) => {
    const incoming = raw
      .map((t) => t.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const next = [...tags];
    for (const t of incoming) {
      if (next.length >= maxTags) return flash(`Max ${maxTags} tags`);
      if (next.some((x) => x.toLowerCase() === t.toLowerCase())) continue;
      next.push(t);
    }
    setTags(next);
  };

  const commit = () => {
    if (value.trim()) addTags([value]);
    setValue("");
  };

  const removeAt = (i) => setTags(tags.filter((_, idx) => idx !== i));

  const onKeyDown = (e) => {
    if (["Enter", ",", ";", ".", "/", "&"].includes(e.key)) {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !value && tags.length) {
      removeAt(tags.length - 1);
    }
  };

  const onPaste = (e) => {
    const text = e.clipboardData?.getData("text") || "";
    if (SEP.test(text)) {
      e.preventDefault();
      addTags(text.split(SEP));
    }
    // no delimiter found: let it paste into the input as one draft tag
  };

  const reset = () => {
    setDragIndex(null);
    setOver(null);
  };

  // dropped in the gap between chips -> reorder
  const dropInGap = (gapIndex) => {
    if (dragIndex === null) return reset();
    const next = [...tags];
    const [moved] = next.splice(dragIndex, 1);
    const insertAt = gapIndex > dragIndex ? gapIndex - 1 : gapIndex;
    next.splice(insertAt, 0, moved);
    setTags(next);
    reset();
  };

  // dropped directly on a chip -> merge the two tags into one, space-joined
  const dropOnChip = (targetIndex) => {
    if (dragIndex === null || dragIndex === targetIndex) return reset();
    const next = [...tags];
    const dragged = next[dragIndex];
    next.splice(dragIndex, 1);
    const at = dragIndex < targetIndex ? targetIndex - 1 : targetIndex;
    next[at] = `${next[at]} ${dragged}`.trim();
    setTags(next);
    reset();
  };

  return (
    <div
      className="w-full rounded-lg border border-line bg-page px-4 py-3.5 transition-colors duration-200 ease-standard focus-within:border-success"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-wrap items-center">
        <span className="mr-5 text-xs leading-relaxed text-ink">
          <FontAwesomeIcon icon={faTags} /> {label}
        </span>
        {tags.map((tag, i) => {
          const { cat, text, color } = parseCategory(tag);
          return (
            <span key={tag + i} style={{ display: "contents" }}>
              <span
                className={[
                  "w-1.5 self-stretch rounded-sm",
                  over?.type === "gap" && over.index === i ? "bg-success" : "",
                ].join(" ")}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOver({ type: "gap", index: i });
                }}
                onDrop={(e) => {
                  e.stopPropagation();
                  dropInGap(i);
                }}
              />
              {/* amber, not the form's green: this is a transient "drop here to
                  merge" state, and reusing the affirmative accent would make it
                  read as a selection rather than a warning. */}
              <span
                className={[
                  "inline-flex cursor-grab items-center gap-1.5 rounded-md px-2.5 py-1.5",
                  "text-xs leading-relaxed text-ink transition-shadow duration-200 ease-standard",
                  over?.type === "merge" && over.index === i
                    ? "bg-amber-950 ring-2 ring-amber-500"
                    : "bg-surface-raised",
                ].join(" ")}
                style={cat ? { "--c": color } : undefined}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver({ type: "merge", index: i });
                }}
                onDragLeave={() => setOver(null)}
                onDrop={() => dropOnChip(i)}
              >
                {/* `--c` is always set when this renders — the same `cat` guards
                    both the prefix and the style above — so no fallback colour
                    is needed. */}
                {cat && (
                  <b className="text-(--c) uppercase">{cat}</b>
                )}
                {text}
                <button
                  className="inline-flex cursor-pointer p-0.5 text-ink-muted transition-colors duration-200 ease-standard hover:text-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAt(i);
                  }}
                  aria-label={`Remove ${text}`}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            </span>
          );
        })}
        {tags.length > 0 && (
          <span
            className={[
              "w-1.5 self-stretch rounded-sm",
              over?.type === "gap" && over.index === tags.length
                ? "bg-success"
                : "",
            ].join(" ")}
            onDragOver={(e) => {
              e.preventDefault();
              setOver({ type: "gap", index: tags.length });
            }}
            onDrop={() => dropInGap(tags.length)}
          />
        )}
        <input
          className="min-w-30 flex-1 border-none bg-transparent px-0.5 py-1.5 text-xs text-ink-strong outline-none placeholder:text-ink-muted disabled:opacity-50"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={commit}
          maxLength={maxTagLength}
          disabled={tags.length >= maxTags}
          placeholder={tags.length ? "" : "Type and press Enter"}
        />
        {/* tabular-nums keeps the counter from shifting the input as the tag
            count crosses a digit-width change. */}
        <span className="text-xs tabular-nums text-ink-muted">
          {tags.length}/{maxTags}
        </span>
      </div>
    </div>
  );
};

export default TagInput;
