/** Image preview for a stored site path or a local blob URL (while uploading). */
export default function Thumb({ src, alt = "", className = "", busy = false }) {
  return (
    <div className={`relative overflow-hidden bg-page ${className}`}>
      {src ? (
        <img src={src} alt={alt} className={`size-full object-cover ${busy ? "opacity-50" : ""}`} />
      ) : (
        <div className="flex size-full items-center justify-center text-xs text-ink-muted">No image</div>
      )}
      {busy && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-ink-strong">
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Uploading...
        </div>
      )}
    </div>
  );
}
