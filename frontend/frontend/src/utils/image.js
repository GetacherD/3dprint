// src/utils/image.js

import { API_BASE_URL } from "../config";

export function getImageUrl(path) {
  if (!path) return "";

  // If already absolute URL → return as is
  if (path.startsWith("http")) {
    return path;
  }

  const base = API_BASE_URL;

  // If no base → use relative (nginx production)
  if (!base) {
    return path;
  }

  return `${base}${path}`;
}