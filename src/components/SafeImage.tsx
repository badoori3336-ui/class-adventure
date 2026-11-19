import React, { useState } from 'react';
import { BookOpen, Calculator, Cpu, FlaskConical, Map } from 'lucide-react';
import { SubjectImageKey } from '../types/adventure';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: SubjectImageKey | 'hero';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'math',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const gradients: Record<SubjectImageKey | 'hero', string> = {
      math: 'from-blue-600 to-indigo-800',
      science: 'from-emerald-600 to-teal-800',
      language: 'from-rose-500 to-amber-600',
      tech: 'from-indigo-700 to-slate-900',
      hero: 'from-sky-500 via-indigo-600 to-emerald-600',
    };

    const IconComponent =
      fallbackType === 'math'
        ? Calculator
        : fallbackType === 'science'
          ? FlaskConical
          : fallbackType === 'language'
            ? BookOpen
            : fallbackType === 'tech'
              ? Cpu
              : Map;

    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br ${gradients[fallbackType]} text-white ${className}`}
      >
        <IconComponent className="w-10 h-10 opacity-90" strokeWidth={1.8} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
