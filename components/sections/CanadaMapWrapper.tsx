"use client";

import dynamic from "next/dynamic";

const CanadaMap = dynamic(() => import("@/components/sections/CanadaMap"), {
  ssr: false,
  loading: () => <div style={{ height: 680, background: "#101010" }} />,
});

export default function CanadaMapWrapper() {
  return <CanadaMap />;
}
