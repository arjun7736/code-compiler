import React from "react";
import { Code, Copy, Download, Sun, Moon } from "lucide-react";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  selectedLanguage: string;
  handleLanguageChange: (language: string) => void;
  languages: { id: number; name: string }[];
  copyCode: () => void;
  downloadCode: () => void;
}

export function Header({
  isDark,
  toggleTheme,
  selectedLanguage,
  handleLanguageChange,
  languages,
  copyCode,
  downloadCode,
}: HeaderProps) {
  return (
    <div
      className={`border-b ${
        isDark ? "border-[#3e3e42]" : "border-gray-200"
      } p-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">CodeCompiler Pro</h1>
          </div>
          <Select
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger
              className={`w-40 ${
                isDark
                  ? "bg-[#2d2d30] border-[#3e3e42]"
                  : "bg-white border-gray-300"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className={
                isDark
                  ? "bg-[#2d2d30] border-[#3e3e42]"
                  : "bg-white border-gray-300"
              }
            >
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.name}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyCode}
            className={`${
              isDark ? "hover:bg-[#2d2d30]" : "hover:bg-gray-100"
            }`}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={downloadCode}
            className={`${
              isDark ? "hover:bg-[#2d2d30]" : "hover:bg-gray-100"
            }`}
          >
            <Download className="w-10 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`${
              isDark ? "hover:bg-[#2d2d30]" : "hover:bg-gray-100"
            }`}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
