import React from "react";
import { Code, Trash2, Play } from "lucide-react";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface EditorPanelProps {
  isDark: boolean;
  selectedLanguage: string;
  languages: { id: number; name: string }[];
  activeWebTab: "html" | "css" | "js";
  setActiveWebTab: (tab: "html" | "css" | "js") => void;
  code: string;
  updateCode: (newCode: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  clearCode: () => void;
  handleRun: () => void;
  isRunning: boolean;
}

export function EditorPanel({
  isDark,
  selectedLanguage,
  languages,
  activeWebTab,
  setActiveWebTab,
  code,
  updateCode,
  handleKeyDown,
  clearCode,
  handleRun,
  isRunning,
}: EditorPanelProps) {
  const editorTheme = isDark
    ? "bg-[#1e1e1e] text-[#d4d4d4] border-[#3e3e42]"
    : "bg-[#fafafa] text-gray-900 border-gray-300";

  return (
    <div className="flex-1 flex flex-col">
      <div
        className={`flex items-center justify-between p-3 border-b ${
          isDark
            ? "border-[#3e3e42] bg-[#252526]"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span className="text-sm font-medium">Editor</span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              isDark
                ? "bg-[#0e639c] text-white"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {languages.find((lang) => lang.name === selectedLanguage)?.name ||
              (selectedLanguage.toLowerCase() === "web" ? "Web" : "")}
          </span>
          {selectedLanguage.toLowerCase() === "web" && (
            <div className="flex items-center ml-2 gap-1 border border-gray-600 rounded bg-black/10 p-0.5">
              <button
                onClick={() => setActiveWebTab("html")}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  activeWebTab === "html"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveWebTab("css")}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  activeWebTab === "css"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setActiveWebTab("js")}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  activeWebTab === "js"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                JS
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCode}
            className={`${
              isDark ? "hover:bg-[#2d2d30]" : "hover:bg-gray-200"
            } text-xs`}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white text-xs"
            size="sm"
          >
            {isRunning ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
            ) : (
              <Play className="w-3 h-3 mr-1" />
            )}
            {isRunning ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-0">
        <Textarea
          value={code}
          onChange={(e) => updateCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Write your ${selectedLanguage} code here...`}
          className={`w-full h-full resize-none border-0 rounded-none font-mono text-sm leading-6 ${editorTheme} focus:ring-0 focus:outline-none`}
          style={{
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            lineHeight: "1.6",
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}
