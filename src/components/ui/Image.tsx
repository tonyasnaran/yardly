import { CldImage } from 'next-cloudinary';
import { useState, useEffect } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function Image({ src, alt, width = 400, height = 300, className = '' }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add file extension if not present
  const imageSrc = src.includes('.') ? src : `${src}.jpg`;

  useEffect(() => {
    // Debug logging
    console.log('Image props:', {
      originalSrc: src,
      processedSrc: imageSrc,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      fullUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/${imageSrc}`
    });
  }, [src, imageSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <CldImage
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => {
          console.log('Image loaded successfully:', imageSrc);
          setIsLoading(false);
        }}
        onError={(error) => {
          console.error('Image loading error:', error);
          setError(`Failed to load image: ${imageSrc}`);
        }}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        loading="lazy"
        crop="fill"
        gravity="auto"
        quality="auto"
        format="auto"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
} 