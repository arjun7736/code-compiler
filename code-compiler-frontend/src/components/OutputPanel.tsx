import React from "react";
import { Terminal, Trash2 } from "lucide-react";
import { Button } from "./button";

interface OutputPanelProps {
  isDark: boolean;
  selectedLanguage: string;
  isRunning: boolean;
  output: any;
  webOutput: string;
  clearOutput: () => void;
}

export function OutputPanel({
  isDark,
  selectedLanguage,
  isRunning,
  output,
  webOutput,
  clearOutput,
}: OutputPanelProps) {
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
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Output</span>
          {isRunning && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearOutput}
          className={`${
            isDark ? "hover:bg-[#2d2d30]" : "hover:bg-gray-200"
          } text-xs`}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>

      <div className="flex-1 p-4">
        {selectedLanguage.toLowerCase() === "web" ? (
          <iframe
            title="Web Visualizer"
            srcDoc={
              webOutput ||
              `<div style="color: ${
                isDark ? "#6a6a6a" : "#9ca3af"
              }; font-family: monospace; font-style: italic;">Output will appear here after running your code...</div>`
            }
            className={`w-full h-full border-none rounded-md ${
              isDark ? "bg-white" : "bg-white"
            }`}
            sandbox="allow-scripts"
          />
        ) : (
          <div
            className={`w-full h-full font-mono text-sm whitespace-pre-wrap overflow-auto ${
              isDark ? "text-[#cccccc]" : "text-gray-800"
            }`}
          >
            {output?.stdout ||
              output?.stderr ||
              output || (
                <div
                  className={`${
                    isDark ? "text-[#6a6a6a]" : "text-gray-500"
                  } italic`}
                >
                  Output will appear here after running your code...
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
