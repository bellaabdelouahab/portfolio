import { useRef, useState } from "react";
import "./TagInput.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTags } from "@fortawesome/free-solid-svg-icons";

const CATEGORY_COLORS = {
  status: "#3b82f6",
  priority: "#f59e0b",
  department: "#10b981",
  default: "#6366f1",
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
    <div className="tag-input" onClick={() => inputRef.current?.focus()}>

      <div className="ti-field">
        <span className="ti-tag-label">
          <FontAwesomeIcon icon={faTags} /> {label}
        </span>
        {tags.map((tag, i) => {
          const { cat, text, color } = parseCategory(tag);
          return (
            <span key={tag + i} style={{ display: "contents" }}>
              <span
                className={`ti-gap ${over?.type === "gap" && over.index === i ? "active" : ""}`}
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
              <span
                className={`ti-chip ${over?.type === "merge" && over.index === i ? "merge" : ""}`}
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
                {cat && <b>{cat}</b>}
                {text}
                <button
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
            className={`ti-gap ${over?.type === "gap" && over.index === tags.length ? "active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setOver({ type: "gap", index: tags.length });
            }}
            onDrop={() => dropInGap(tags.length)}
          />
        )}
        <input
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
        <span className="ti-count">
          {tags.length}/{maxTags}
        </span>
      </div>
    </div>
  );
};

export default TagInput;
