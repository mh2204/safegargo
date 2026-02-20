import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface MapInputProps {
  label: string;
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  apiKey: string;
  placeholder?: string;
}

interface Suggestion {
  title: string;
  id: string;
  position?: {
    lat: number;
    lng: number;
  };
}

const MapInput = ({ label, value, onChange, apiKey, placeholder }: MapInputProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, apiKey]);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${apiKey}&limit=5&country=ke` // Restricted to Kenya
      );
      const data = await response.json();

      if (data.features) {
        const formattedSuggestions = data.features.map((f: any) => ({
          title: f.place_name,
          id: f.id,
          position: {
            lat: f.center[1],
            lng: f.center[0],
          }
        }));
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(
      suggestion.title,
      suggestion.position?.lat,
      suggestion.position?.lng
    );
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor={label}>{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm">{suggestion.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapInput;
