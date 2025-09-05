import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const KeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Google-style keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Focus search bar
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.select();
            }
            break;
          case '/':
            e.preventDefault();
            // Focus search bar (alternative)
            const searchInput2 = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            if (searchInput2) {
              searchInput2.focus();
            }
            break;
          case 'Enter':
            if (e.shiftKey) {
              e.preventDefault();
              // I'm Feeling Lucky equivalent
              navigate('/categories');
            }
            break;
        }
      }

      // Escape key handling
      if (e.key === 'Escape') {
        // Close any open dropdowns or modals
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.blur();
        }
      }

      // Quick navigation shortcuts
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigate('/');
            break;
          case '2':
            e.preventDefault();
            navigate('/categories');
            break;
          case '3':
            e.preventDefault();
            navigate('/about');
            break;
          case '4':
            e.preventDefault();
            navigate('/contact');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  return null; // This component doesn't render anything
};