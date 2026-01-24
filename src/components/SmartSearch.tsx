import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Search, Brain, Loader2, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface SmartSearchProps {
  onSearchResults?: (results: SearchResult[]) => void;
  placeholder?: string;
  className?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  source?: string;
  relevance?: number;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const SmartSearch = ({ 
  onSearchResults, 
  placeholder = "Search anything in the world...",
  className = ""
}: SmartSearchProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const performPerplexitySearch = async (searchQuery: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the AI-powered search feature",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the edge function instead of exposing API key client-side
      const { data, error } = await supabase.functions.invoke('perplexity-search', {
        body: { query: searchQuery }
      });

      if (error) {
        throw new Error(error.message);
      }

      const searchResults = parseSearchResults(data.choices[0].message.content, searchQuery);
      
      setResults(searchResults);
      if (onSearchResults) {
        onSearchResults(searchResults);
      }
      
      toast({
        title: "Search Complete",
        description: `Found ${searchResults.length} results for "${searchQuery}"`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseSearchResults = (content: string, searchQuery: string): SearchResult[] => {
    try {
      // Try to parse JSON if the AI returned it
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If JSON parsing fails, create results from the text content
    }

    // Fallback: create results from the text content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 5).map((sentence, index) => ({
      id: `search-${index}`,
      title: `Result ${index + 1}: ${searchQuery}`,
      description: sentence.trim(),
      category: "web",
      source: "Perplexity AI",
      relevance: 0.9 - (index * 0.1)
    }));
  };

  const handleSearch = () => {
    if (query.trim()) {
      performPerplexitySearch(query.trim());
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {!user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI-Powered Global Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign in to access our AI-powered search feature and search for real-time information about anything in the world.
            </p>
            <Button asChild>
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Search
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder={placeholder}
              className="pl-10"
              disabled={!user}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !query.trim() || !user}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Search Results ({results.length})</h3>
          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={result.id || index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{result.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{result.category || "Web"}</Badge>
                        {result.source && (
                          <span className="text-xs text-muted-foreground">
                            Source: {result.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
