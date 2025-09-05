import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Search, Brain, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SmartSearchProps {
  onSearchResults?: (results: any[]) => void;
  placeholder?: string;
  className?: string;
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
  const [results, setResults] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const { toast } = useToast();

  const performPerplexitySearch = async (searchQuery: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to search",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides accurate, up-to-date information. Format your response as a JSON array of search results with title, description, and category fields.'
            },
            {
              role: 'user',
              content: `Search for information about: ${searchQuery}. Provide 5-10 relevant results with title, description, and category.`
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'month',
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
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
        description: "Failed to perform search. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseSearchResults = (content: string, query: string) => {
    try {
      // Try to parse JSON if the AI returned it
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, create results from the text content
    }

    // Fallback: create results from the text content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 5).map((sentence, index) => ({
      id: `search-${index}`,
      title: `Result ${index + 1}: ${query}`,
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

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
      toast({
        title: "API Key Set",
        description: "You can now search for anything in the world!",
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showApiKeyInput && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI-Powered Global Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your Perplexity API key to search for real-time information about anything in the world.
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Perplexity API key..."
                className="flex-1"
              />
              <Button onClick={handleApiKeySubmit} disabled={!apiKey.trim()}>
                Set API Key
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a 
                href="https://www.perplexity.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                perplexity.ai
              </a>
            </p>
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
              disabled={showApiKeyInput}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !query.trim() || showApiKeyInput}
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