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

  useEffect(() => {
    // Debug logging
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    // Remove any ":1" suffix and ensure .jpg extension
    const cleanSrc = src.replace(/:1$/, '');
    const fullUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${cleanSrc}`;
    
    console.log('Image props:', {
      originalSrc: src,
      cleanSrc,
      cloudName,
      fullUrl,
      // Log the actual URL being used by CldImage
      cldUrl: `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_auto,q_auto,w_${width},h_${height}/${cleanSrc}`
    });

    // Test if the image exists
    fetch(fullUrl)
      .then(response => {
        if (!response.ok) {
          console.error(`Image not found: ${fullUrl}`);
          setError(`Image not found: ${cleanSrc}`);
        }
      })
      .catch(err => {
        console.error('Error checking image:', err);
        setError(`Error loading image: ${cleanSrc}`);
      });
  }, [src, width, height]);

  // Remove any ":1" suffix for the CldImage component
  const cleanSrc = src.replace(/:1$/, '');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <CldImage
        src={cleanSrc}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => {
          console.log('Image loaded successfully:', cleanSrc);
          setIsLoading(false);
        }}
        onError={(error) => {
          console.error('Image loading error:', error);
          setError(`Failed to load image: ${cleanSrc}`);
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