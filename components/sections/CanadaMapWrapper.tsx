"use client";

import dynamic from "next/dynamic";

const CanadaMap = dynamic(() => import("@/components/sections/CanadaMap"), {
  ssr: false,
  loading: () => <div style={{ height: 680, background: "#080d16" }} />,
});

export default function CanadaMapWrapper() {
  return <CanadaMap />;
}
