import React from "react";

interface StatusBarProps {
  isDark: boolean;
  selectedLanguage: string;
  linesCount: number;
  charsCount: number;
}

export function StatusBar({
  isDark,
  selectedLanguage,
  linesCount,
  charsCount,
}: StatusBarProps) {
  return (
    <div
      className={`border-t ${
        isDark ? "border-[#3e3e42] bg-[#007acc]" : "border-gray-200 bg-blue-600"
      } px-4 py-2`}
    >
      <div className="flex items-center justify-between text-white text-xs">
        <div className="flex items-center gap-4">
          <span>Ready</span>
          <span>Lines: {linesCount}</span>
          <span>Characters: {charsCount}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{selectedLanguage.toUpperCase()}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
      </div>
    </div>
  );
}
