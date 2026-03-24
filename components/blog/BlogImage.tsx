import Image from "next/image";

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function BlogImage({ src, alt, caption }: BlogImageProps) {
  return (
    <figure className="my-8">
      <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-center" style={{ color: "var(--text-muted)" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
