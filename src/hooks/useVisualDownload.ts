import { useCallback, RefObject } from 'react';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';

export const useVisualDownload = () => {
  const downloadPng = useCallback(async (ref: RefObject<HTMLDivElement>, filename?: string) => {
    if (!ref.current) return;

    try {
      const dataUrl = await toPng(ref.current, {
        pixelRatio: 2,
        cacheBust: true,
        style: {
          transform: 'none',
          transformOrigin: 'top left',
        },
        width: ref.current.scrollWidth,
        height: ref.current.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = filename || `az-visual-${format(new Date(), 'yyyyMMdd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  }, []);

  return { downloadPng };
};
