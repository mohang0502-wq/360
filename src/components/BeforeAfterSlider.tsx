import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight, ZoomIn, X } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
  category?: string;
  zoomable?: boolean;
  className?: string;
  aspectRatio?: string;
}

function SliderCore({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
  aspectRatio = 'aspect-[4/3]',
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current) updatePosition(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (dragging.current) updatePosition(e.touches[0].clientX);
    };
    const onEnd = () => { dragging.current = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className={`ba-slider-container w-full ${aspectRatio} select-none`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Before image */}
      <div className="ba-slider-before absolute inset-0">
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="w-full h-full object-contain bg-slate-100"
          draggable={false}
        />
      </div>

      {/* After image clipped */}
      <div
        className="ba-slider-after"
        ref={(el) => { if (el) el.style.clipPath = `inset(0 0 0 ${sliderPos}%)`; }}
      >
        <img src={afterSrc} alt={afterAlt} draggable={false} className="object-contain bg-slate-100" />
      </div>

      {/* Labels */}
      <span className="ba-label ba-label-before">Before</span>
      <span className="ba-label ba-label-after">After</span>

      {/* Handle */}
      <div
        className="ba-slider-handle"
        ref={(el) => { if (el) el.style.left = `${sliderPos}%`; }}
      >
        <div className="ba-slider-handle-circle">
          <ChevronsLeftRight size={20} className="text-slate-800" />
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSlider(props: BeforeAfterSliderProps) {
  const { caption, category, zoomable = true, className = '' } = props;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className={`group relative rounded-xl overflow-hidden ${className}`}>
        <SliderCore {...props} />
        {/* Caption bar */}
        {(caption || category) && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent px-4 py-3">
            {category && (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold tracking-widest uppercase text-white/70 mb-1">
                {category}
              </span>
            )}
            {caption && <p className="text-sm font-medium text-white">{caption}</p>}
          </div>
        )}
        {/* Zoom button */}
        {zoomable && (
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-800 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
            title="View full size"
          >
            <ZoomIn size={16} />
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div
            className="relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
            >
              <X size={28} />
            </button>
            <SliderCore {...props} aspectRatio="aspect-[16/9]" />
            {caption && (
              <p className="text-center text-white/70 text-sm mt-4">{caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
