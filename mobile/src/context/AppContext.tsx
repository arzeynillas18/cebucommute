import React, { createContext, useContext, useState } from "react";

type Lang = "en" | "fil";
type FontSizeLevel = "Small" | "Medium" | "Large";

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  fontSize: FontSizeLevel;
  setFontSize: (f: FontSizeLevel) => void;
  t: (en: string, fil: string) => string;
  fs: (base: number) => number;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [fontSize, setFontSize] = useState<FontSizeLevel>("Medium");

  const t = (en: string, fil: string) => (lang === "en" ? en : fil);

  const fs = (base: number) => {
    if (fontSize === "Small") return base - 2;
    if (fontSize === "Large") return base + 2;
    return base;
  };

  return (
    <AppContext.Provider
      value={{ lang, setLang, fontSize, setFontSize, t, fs }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
