import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The whole app is client-rendered (door intro, sections) with no API
  // routes or SSR data — a static export runs it as plain HTML/CSS/JS on any
  // static host (Cloudflare Pages), with no server function to go down.
  output: "export",
};

export default nextConfig;
