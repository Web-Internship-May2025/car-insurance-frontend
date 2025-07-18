import React, { useState, useEffect } from "react";

interface ProtectedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  token?: string;
}

export function ProtectedImage({
  src,
  token,
  ...imgProps
}: ProtectedImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const jwt = token ?? localStorage.getItem("jwtToken");

    fetch(src, {
      method: "GET",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Image load failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch((err) => {
        console.error("ProtectedImage error:", err);
      });

    return () => {
      cancelled = true;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src, token]);

  if (!blobUrl) return null;

  return <img src={blobUrl} {...imgProps} />;
}
