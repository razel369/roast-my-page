import type { RoastResult } from "./types";
import { decodeRoast, encodeRoast } from "./storage";

export function buildShareUrl(result: RoastResult): string {
  if (typeof window === "undefined") return `/r/${encodeRoast(result)}`;
  return `${window.location.origin}/r/${encodeRoast(result)}`;
}

export function readRoastFromPath(id: string): RoastResult | null {
  return decodeRoast(id);
}