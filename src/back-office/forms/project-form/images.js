/**
 * Image preparation for the wizard. The site serves WebP only (max 1440 px
 * wide), so anything else is converted in the browser before it is uploaded.
 */
export const MAX_WIDTH = 1440;
export const MAX_BYTES = 5 * 1024 * 1024;
const QUALITY = 0.85;

async function decode(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("unreadable"));
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

const toBlob = (canvas) => new Promise((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
const bigName = (n) => `"${n}" is larger than 5 MB even after conversion.`;

/**
 * Resolves with `{ file, converted }`, or throws an Error with a short message.
 * A WebP no wider than 1440 px and under 5 MB is used as is.
 */
export async function prepareImage(file) {
  if (!file || !String(file.type).startsWith("image/")) throw new Error(`"${file?.name || "File"}" is not an image.`);
  const isWebp = file.type === "image/webp";
  if (isWebp && file.size <= MAX_BYTES) {
    try {
      const bmp = await decode(file);
      if (bmp.width <= MAX_WIDTH) return { file, converted: false };
    } catch {
      return { file, converted: false };
    }
  }
  let bmp;
  try {
    bmp = await decode(file);
  } catch {
    throw new Error(`"${file.name}" could not be read as an image.`);
  }
  const scale = Math.min(1, MAX_WIDTH / bmp.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bmp.width * scale));
  canvas.height = Math.max(1, Math.round(bmp.height * scale));
  canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob = await toBlob(canvas);
  if (!blob || blob.type !== "image/webp") throw new Error("This browser cannot convert images to WebP. Pick a .webp file.");
  if (blob.size > MAX_BYTES) throw new Error(bigName(file.name));
  const name = `${file.name.replace(/\.[^.]+$/, "")}.webp`;
  return { file: new File([blob], name, { type: "image/webp" }), converted: !isWebp || scale < 1 };
}

const rand = () => Math.random().toString(36).slice(2, 7);
/** Final storage path (repo layout) for a new cover or screenshot. */
export const coverAssetPath = (projectId) => `public/images/projects/${projectId}/${Date.now()}-${rand()}.webp`;
export const shotAssetPath = (projectId) => `public/images/projects/${projectId}/carousel/${Date.now()}-${rand()}.webp`;
/** "public/images/x.webp" -> "/images/x.webp" */
export const sitePath = (assetPath) => assetPath.replace(/^public/, "");
export const assetFromSite = (p) => `public${p}`;

export const captionFromName = (name) => name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
