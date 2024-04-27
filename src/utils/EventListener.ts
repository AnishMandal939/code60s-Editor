// KeyEventListener.tsx
import { useEffect } from 'react';

export const useRunEventListener = (onRun: () => void) => {
  useEffect(() => {
    const onKeyPress = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey && ev.key === "r") || (ev.metaKey && ev.key === "r")) {
        ev.preventDefault();
        ev.stopPropagation();
        onRun();
      }
    };

    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [onRun]); // Add onRun to the dependency array
};

// unused code - will work on this in future
export const useDevToolsEventListener = (onOpenDevTools: () => void) => {
    useEffect(() => {
        const onKeyPress = (ev: KeyboardEvent) => {
            if ((ev.ctrlKey && ev.key === "i" && ev.shiftKey) || (ev.metaKey && ev.key === "i" && ev.altKey)) {
                ev.preventDefault();
                ev.stopPropagation();
                onOpenDevTools();
            }
        };

        document.addEventListener("keydown", onKeyPress);

        return () => {
            document.removeEventListener("keydown", onKeyPress);
        };
    }, [onOpenDevTools]); // Add onOpenDevTools to the dependency array
};
