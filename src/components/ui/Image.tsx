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
    const fullUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1743325459/${src}.jpg`;
    
    console.log('Image props:', {
      src,
      cloudName,
      fullUrl,
      // Log the actual URL being used by CldImage
      cldUrl: `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_auto,q_auto,w_${width},h_${height}/v1743325459/${src}.jpg`
    });

    // Test if the image exists
    fetch(fullUrl)
      .then(response => {
        if (!response.ok) {
          console.error(`Image not found: ${fullUrl}`);
          setError(`Image not found: ${src}`);
        }
      })
      .catch(err => {
        console.error('Error checking image:', err);
        setError(`Error loading image: ${src}`);
      });
  }, [src, width, height]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <CldImage
        src={`v1743325459/${src}.jpg`}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => {
          console.log('Image loaded successfully:', src);
          setIsLoading(false);
        }}
        onError={(error) => {
          console.error('Image loading error:', error);
          setError(`Failed to load image: ${src}`);
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