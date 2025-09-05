import { useState, useRef, useEffect } from "react";
import { Search, Mic, Camera, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { useNavigate } from "react-router-dom";

interface SearchSuggestion {
  text: string;
  type: "suggestion" | "history" | "trending";
}

interface SearchBarProps {
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  showSuggestions = true, 
  onSearch,
  placeholder = "Search services, solutions, or ask a question...",
  className = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock suggestions based on your services
  const mockSuggestions: SearchSuggestion[] = [
    { text: "cybersecurity audit", type: "trending" },
    { text: "custom software development", type: "suggestion" },
    { text: "network setup", type: "suggestion" },
    { text: "database management", type: "suggestion" },
    { text: "cloud migration", type: "trending" },
    { text: "hardware solutions", type: "suggestion" },
    { text: "penetration testing", type: "trending" },
    { text: "web development", type: "suggestion" },
  ];

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // Navigate to products with search query
        navigate(`/categories?search=${encodeURIComponent(searchQuery)}`);
      }
      setShowDropdown(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length > 0 && showSuggestions) {
      const filtered = mockSuggestions.filter(s => 
        s.text.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleVoiceSearch = () => {
    // Check if Speech Recognition is available
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearch(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      // Fallback for browsers that don't support speech recognition
      alert('Speech recognition is not supported in your browser');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={`relative max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
              if (e.key === 'Escape') {
                setShowDropdown(false);
              }
            }}
            placeholder={placeholder}
            className="pl-12 pr-20 h-12 text-lg rounded-full border-2 focus:border-primary transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setShowDropdown(false);
                }}
                className="h-8 w-8 rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceSearch}
              disabled={isListening}
              className={`h-8 w-8 rounded-full hover:bg-muted ${isListening ? 'bg-destructive/10 text-destructive' : ''}`}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Visual search functionality
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    // For now, simulate visual search
                    setQuery(`visual search: ${file.name}`);
                    handleSearch(`visual search: ${file.name}`);
                  }
                };
                input.click();
              }}
              className="h-8 w-8 rounded-full hover:bg-muted"
              title="Search by image"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <Card className="absolute top-full mt-2 w-full z-50 shadow-lg animate-fade-in">
            <CardContent className="p-0">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(suggestion.text);
                    handleSearch(suggestion.text);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{suggestion.text}</span>
                  {suggestion.type === "trending" && (
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Trending
                    </span>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={() => handleSearch()}
          className="bg-muted hover:bg-muted/80 text-foreground border border-border"
        >
          Search Services
        </Button>
        <Button
          onClick={() => navigate('/categories')}
          className="bg-muted hover:bg-muted/80 text-foreground border border-border"
        >
          I'm Feeling Lucky
        </Button>
      </div>
    </div>
  );
};