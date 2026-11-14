import { apiBase } from "./config";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/** Small fetch wrapper: JSON in/out, optional Discord bearer token, readable errors. */
export async function api(path, { method = "GET", body, token, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  let res;
  try {
    res = await fetch(`${apiBase()}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError("Couldn't reach Rift right now. Try again in a moment.", 0);
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty or non-JSON body */
  }
  if (!res.ok) {
    throw new ApiError(data?.error || `Something went wrong (${res.status}).`, res.status);
  }
  return data;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

/** Upload an image (staff only). Resolves to the new image id. */
export async function uploadImage(file, token) {
  if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type)) {
    throw new Error("Only PNG, JPEG, GIF or WebP images can be uploaded.");
  }
  if (file.size > 3 * 1024 * 1024) throw new Error("That image is over 3 MB.");
  const image = await fileToDataUrl(file);
  const { id } = await api("/blog/images", { method: "POST", body: { image }, token });
  return id;
}
