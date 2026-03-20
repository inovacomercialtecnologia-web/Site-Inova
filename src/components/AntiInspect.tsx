import { useEffect } from 'react';

const AntiInspect = () => {
  useEffect(() => {
    // ── Block right-click ──
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // ── Block DevTools keyboard shortcuts ──
    const onKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        return;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return;
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return;
      }
    };

    // ── Block drag on images and elements ──
    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // ── DevTools detection — redirect silently ──
    let devtoolsOpen = false;
    const threshold = 160;

    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          window.location.replace('about:blank');
        }
      } else {
        devtoolsOpen = false;
      }
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('dragstart', onDragStart);

    const resizeCheck = setInterval(checkDevTools, 1000);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('dragstart', onDragStart);
      clearInterval(resizeCheck);
    };
  }, []);

  return null;
};

export default AntiInspect;
