import React from "react";
import { Check, Paintbrush } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ThemeCustomizerProps {
  className?: string;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = React.useState<string>("indigo");

  // Available accent colors
  const accentColors = [
    { name: "Indigo", value: "indigo", hue: 240, class: "bg-indigo-500" },
    { name: "Rose", value: "rose", hue: 350, class: "bg-rose-500" },
    { name: "Blue", value: "blue", hue: 210, class: "bg-blue-500" },
    { name: "Green", value: "green", hue: 140, class: "bg-green-500" },
    { name: "Orange", value: "orange", hue: 30, class: "bg-orange-500" },
    { name: "Purple", value: "purple", hue: 270, class: "bg-purple-500" },
    { name: "Teal", value: "teal", hue: 180, class: "bg-teal-500" },
    { name: "Amber", value: "amber", hue: 40, class: "bg-amber-500" },
  ];

  // Update CSS variables when accent color changes
  React.useEffect(() => {
    const selectedColor = accentColors.find(color => color.value === accentColor);
    if (selectedColor) {
      // Update primary and accent color variables
      document.documentElement.style.setProperty('--primary', `${selectedColor.hue} 100% 50%`);
      document.documentElement.style.setProperty('--accent', `${selectedColor.hue} 40% 96.1%`);
      // Store the selected accent color in localStorage
      localStorage.setItem('accent-color', selectedColor.value);
    }
  }, [accentColor]);

  // Load saved accent color on component mount
  React.useEffect(() => {
    const savedAccentColor = localStorage.getItem('accent-color');
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`${className} tour-theme`}
        >
          <Paintbrush className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Appearance</h4>
            <Tabs 
              defaultValue={theme} 
              value={theme} 
              onValueChange={(value) => setTheme(value as "light" | "dark")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="light">Light</TabsTrigger>
                <TabsTrigger value="dark">Dark</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-1.5">
            <h4 className="font-medium text-sm">Accent Color</h4>
            <div className="grid grid-cols-4 gap-2">
              {accentColors.map((color) => (
                <Button
                  key={color.value}
                  variant="outline"
                  size="sm"
                  className="p-0 h-8 w-full"
                  onClick={() => setAccentColor(color.value)}
                >
                  <div className="flex items-center justify-center gap-1">
                    <div className={`h-4 w-4 rounded ${color.class}`}></div>
                    {accentColor === color.value && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="pt-2 text-xs text-muted-foreground">
            Customize the appearance of the dashboard to match your preferences.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeCustomizer;
