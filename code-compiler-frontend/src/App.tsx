import React, { useEffect } from "react";
import { useState } from "react";
import {
  Play,
  Trash2,
  Sun,
  Moon,
  Code,
  Terminal,
  Copy,
  Download,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/select";
import { Button } from "./components/button";
import { Textarea } from "./components/textarea";
import { Separator } from "./components/seperator";
import { useLanguageStore } from "../store/compiler";

function App() {
  const { language, fetchLanguages } = useLanguageStore();

   useEffect(() => {
    fetchLanguages();
  }, []);

  const defaultCode = {
    javascript: ` Welcome to the Online Code Compiler Please select a language and start coding!`,
  };

  const [isDark, setIsDark] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode.javascript);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    // Define pairs
    const pairs: { [key: string]: string } = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    const key = e.key;

    // Handle auto-pairing
    if (pairs[key]) {
      e.preventDefault();

      const beforeCursor = value.substring(0, selectionStart);
      const afterCursor = value.substring(selectionEnd);
      const selectedText = value.substring(selectionStart, selectionEnd);

      let newValue: string;
      let newCursorPos: number;

      if (selectedText) {
        // Wrap selected text with the pair
        newValue = beforeCursor + key + selectedText + pairs[key] + afterCursor;
        newCursorPos = selectionStart + 1 + selectedText.length;
      } else {
        // Insert pair and position cursor between them
        newValue = beforeCursor + key + pairs[key] + afterCursor;
        newCursorPos = selectionStart + 1;
      }

      setCode(newValue);

      // Set cursor position after state update
      setTimeout(() => {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }

    // Handle closing bracket/quote deletion (backspace)
    else if (e.key === "Backspace") {
      const charBefore = value[selectionStart - 1];
      const charAfter = value[selectionStart];

      // Check if we're deleting an opening bracket/quote that has its pair right after
      if (
        pairs[charBefore] &&
        pairs[charBefore] === charAfter &&
        selectionStart === selectionEnd
      ) {
        e.preventDefault();
        const newValue =
          value.substring(0, selectionStart - 1) +
          value.substring(selectionStart + 1);
        setCode(newValue);

        setTimeout(() => {
          textarea.setSelectionRange(selectionStart - 1, selectionStart - 1);
        }, 0);
      }
    }

    // Handle closing bracket/quote skipping
    else if (
      key === ")" ||
      key === "]" ||
      key === "}" ||
      key === '"' ||
      key === "'" ||
      key === "`"
    ) {
      const charAfter = value[selectionStart];

      // Skip if the next character is the same as what we're typing
      if (charAfter === key && selectionStart === selectionEnd) {
        e.preventDefault();
        setTimeout(() => {
          textarea.setSelectionRange(selectionStart + 1, selectionStart + 1);
        }, 0);
      }
    }

    // Handle Enter key for auto-indentation with brackets
    else if (e.key === "Enter") {
      const charBefore = value[selectionStart - 1];
      const charAfter = value[selectionStart];

      if (
        (charBefore === "{" && charAfter === "}") ||
        (charBefore === "[" && charAfter === "]") ||
        (charBefore === "(" && charAfter === ")")
      ) {
        e.preventDefault();

        // Get current line indentation
        const lines = value.substring(0, selectionStart).split("\n");
        const currentLine = lines[lines.length - 1];
        const indentMatch = currentLine.match(/^(\s*)/);
        const currentIndent = indentMatch ? indentMatch[1] : "";
        const newIndent = currentIndent + "  "; // Add 2 spaces for indentation

        const newValue =
          value.substring(0, selectionStart) +
          "\n" +
          newIndent +
          "\n" +
          currentIndent +
          value.substring(selectionStart);

        setCode(newValue);

        setTimeout(() => {
          const newPos = selectionStart + 1 + newIndent.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      }
    }
  };
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(
      defaultCode[language as keyof typeof defaultCode] ||
        `// ${language} code here`
    );
    setOutput("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      const mockOutput = `Executing ${selectedLanguage} code...
Hello, World!
Fibonacci sequence:
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34

Process finished with exit code 0
Execution time: 0.234s`;
      setOutput(mockOutput);
      setIsRunning(false);
    }, 1500);
  };

  const clearCode = () => {
    setCode("");
  };

  const clearOutput = () => {
    setOutput("");
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };


  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const themeClasses = isDark
    ? "bg-[#1e1e1e] text-[#d4d4d4] border-[#3e3e42]"
    : "bg-white text-gray-900 border-gray-200";

  const editorTheme = isDark
    ? "bg-[#1e1e1e] text-[#d4d4d4] border-[#3e3e42]"
    : "bg-[#fafafa] text-gray-900 border-gray-300";

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-200 ${themeClasses}`}
      >
        {/* Header */}
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
                  {language.map((lang) => (
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

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Code Editor Panel */}
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
                  {
                    language.find((lang) => lang.name === selectedLanguage)
                      ?.name
                  }
                </span>
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
                onChange={(e) => setCode(e.target.value)}
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

          {/* Vertical Separator */}
          <Separator
            orientation="vertical"
            className={isDark ? "bg-[#3e3e42]" : "bg-gray-200"}
          />

          {/* Output Panel */}
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
              <div
                className={`w-full h-full font-mono text-sm whitespace-pre-wrap ${
                  isDark ? "text-[#cccccc]" : "text-gray-800"
                }`}
              >
                {output || (
                  <div
                    className={`${
                      isDark ? "text-[#6a6a6a]" : "text-gray-500"
                    } italic`}
                  >
                    Output will appear here after running your code...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div
          className={`border-t ${
            isDark
              ? "border-[#3e3e42] bg-[#007acc]"
              : "border-gray-200 bg-blue-600"
          } px-4 py-2`}
        >
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-4">
              <span>Ready</span>
              <span>Lines: {code.split("\n").length}</span>
              <span>Characters: {code.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{selectedLanguage.toUpperCase()}</span>
              <span>UTF-8</span>
              <span>LF</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
