import { useEffect, useState } from "react";

/** Image preview for either a freshly picked File or a stored site path. */
export default function Thumb({ file, src, alt = "", className = "" }) {
  const [url, setUrl] = useState(src || null);
  useEffect(() => {
    if (file) {
      const u = URL.createObjectURL(file);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setUrl(src || null);
    return undefined;
  }, [file, src]);
  if (!url) {
    return <div className={`flex items-center justify-center bg-page text-[0.65rem] text-ink-muted ${className}`}>No image</div>;
  }
  return <img src={url} alt={alt} className={`bg-page object-cover ${className}`} />;
}
