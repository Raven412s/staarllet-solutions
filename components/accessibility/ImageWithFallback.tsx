// app/components/ImageWithFallback.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps extends React.ComponentProps<typeof Image> {
  fallbackSrc: string;
}

export function ImageWithFallback({ src, fallbackSrc, alt, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  if (!imgSrc.toString().startsWith('/')) {
    setImgSrc(`/${src}`);
  }

  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={(e) =>{
        e.preventDefault()
         setImgSrc(fallbackSrc)
        }}
    />
  );
}
