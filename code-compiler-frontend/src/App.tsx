import React, { useEffect, useState } from "react";
import { useLanguageStore } from "../store/compiler";
import { Separator } from "./components/seperator";
import { Header } from "./components/Header";
import { EditorPanel } from "./components/EditorPanel";
import { OutputPanel } from "./components/OutputPanel";
import { StatusBar } from "./components/StatusBar";

function App() {
  const { language, fetchLanguages, submitCode } = useLanguageStore();

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const defaultCode = {
    javascript: ` Welcome to the Online Code Compiler Please select a language and start coding!`,
    web: `<!-- Web Visualizer -->\n<h1>Hello World</h1>`,
  };

  const [isDark, setIsDark] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode.javascript);
  
  // Web Visualizer States
  const [htmlCode, setHtmlCode] = useState(defaultCode.web);
  const [cssCode, setCssCode] = useState("h1 {\n  color: #007acc;\n}");
  const [jsCode, setJsCode] = useState("console.log('Hello from Web!');");
  const [activeWebTab, setActiveWebTab] = useState<"html" | "css" | "js">("html");
  const [webOutput, setWebOutput] = useState("");

  const [output, setOutput] = useState<any>("");
  const [isRunning, setIsRunning] = useState(false);

  const getCode = () => {
    if (selectedLanguage.toLowerCase() === "web") {
      if (activeWebTab === "html") return htmlCode;
      if (activeWebTab === "css") return cssCode;
      return jsCode;
    }
    return code;
  };

  const updateCode = (newCode: string) => {
    if (selectedLanguage.toLowerCase() === "web") {
      if (activeWebTab === "html") setHtmlCode(newCode);
      else if (activeWebTab === "css") setCssCode(newCode);
      else setJsCode(newCode);
    } else {
      setCode(newCode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    const pairs: { [key: string]: string } = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    const key = e.key;

    if (pairs[key]) {
      e.preventDefault();
      const beforeCursor = value.substring(0, selectionStart);
      const afterCursor = value.substring(selectionEnd);
      const selectedText = value.substring(selectionStart, selectionEnd);
      let newValue: string;
      let newCursorPos: number;

      if (selectedText) {
        newValue = beforeCursor + key + selectedText + pairs[key] + afterCursor;
        newCursorPos = selectionStart + 1 + selectedText.length;
      } else {
        newValue = beforeCursor + key + pairs[key] + afterCursor;
        newCursorPos = selectionStart + 1;
      }
      updateCode(newValue);
      setTimeout(() => {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else if (e.key === "Backspace") {
      const charBefore = value[selectionStart - 1];
      const charAfter = value[selectionStart];
      if (
        pairs[charBefore] &&
        pairs[charBefore] === charAfter &&
        selectionStart === selectionEnd
      ) {
        e.preventDefault();
        const newValue =
          value.substring(0, selectionStart - 1) +
          value.substring(selectionStart + 1);
        updateCode(newValue);
        setTimeout(() => {
          textarea.setSelectionRange(selectionStart - 1, selectionStart - 1);
        }, 0);
      }
    } else if (
      key === ")" ||
      key === "]" ||
      key === "}" ||
      key === '"' ||
      key === "'" ||
      key === "`"
    ) {
      const charAfter = value[selectionStart];
      if (charAfter === key && selectionStart === selectionEnd) {
        e.preventDefault();
        setTimeout(() => {
          textarea.setSelectionRange(selectionStart + 1, selectionStart + 1);
        }, 0);
      }
    } else if (e.key === "Enter") {
      const charBefore = value[selectionStart - 1];
      const charAfter = value[selectionStart];
      if (
        (charBefore === "{" && charAfter === "}") ||
        (charBefore === "[" && charAfter === "]") ||
        (charBefore === "(" && charAfter === ")")
      ) {
        e.preventDefault();
        const lines = value.substring(0, selectionStart).split("\n");
        const currentLine = lines[lines.length - 1];
        const indentMatch = currentLine.match(/^(\s*)/);
        const currentIndent = indentMatch ? indentMatch[1] : "";
        const newIndent = currentIndent + "  ";
        const newValue =
          value.substring(0, selectionStart) +
          "\n" +
          newIndent +
          "\n" +
          currentIndent +
          value.substring(selectionStart);
        updateCode(newValue);
        setTimeout(() => {
          const newPos = selectionStart + 1 + newIndent.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      }
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (language.toLowerCase() !== "web") {
      setCode(
        defaultCode[language as keyof typeof defaultCode] ||
          `// ${language} code here`
      );
    }
    setOutput("");
    setWebOutput("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    if (selectedLanguage.toLowerCase() === "web") {
      const combinedOutput = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${cssCode}</style>
          </head>
          <body>
            ${htmlCode}
            <script>${jsCode}<\/script>
          </body>
        </html>
      `;
      setWebOutput(combinedOutput);
      setIsRunning(false);
      return;
    }

    try {
      const result = await submitCode(code, selectedLanguage.toLowerCase());
      setOutput(result || "No output received");
    } catch (err) {
      console.error(err);
      setOutput("Error while running code");
    }
    setIsRunning(false);
  };

  const clearCode = () => {
    updateCode("");
  };

  const clearOutput = () => {
    setOutput("");
    setWebOutput("");
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCode());
  };

  const downloadCode = () => {
    if (selectedLanguage.toLowerCase() === "web") {
      const combinedOutput = `
<!DOCTYPE html>
<html>
  <head>
    <style>${cssCode}</style>
  </head>
  <body>
    ${htmlCode}
    <script>${jsCode}<\/script>
  </body>
</html>`;
      const blob = new Blob([combinedOutput], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `index.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
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

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-200 ${themeClasses} flex flex-col`}
      >
        <Header
          isDark={isDark}
          toggleTheme={toggleTheme}
          selectedLanguage={selectedLanguage}
          handleLanguageChange={handleLanguageChange}
          languages={language}
          copyCode={copyCode}
          downloadCode={downloadCode}
        />

        <div className="flex flex-1 overflow-hidden">
          <EditorPanel
            isDark={isDark}
            selectedLanguage={selectedLanguage}
            languages={language}
            activeWebTab={activeWebTab}
            setActiveWebTab={setActiveWebTab}
            code={getCode()}
            updateCode={updateCode}
            handleKeyDown={handleKeyDown}
            clearCode={clearCode}
            handleRun={handleRun}
            isRunning={isRunning}
          />

          <Separator
            orientation="vertical"
            className={isDark ? "bg-[#3e3e42]" : "bg-gray-200"}
          />

          <OutputPanel
            isDark={isDark}
            selectedLanguage={selectedLanguage}
            isRunning={isRunning}
            output={output}
            webOutput={webOutput}
            clearOutput={clearOutput}
          />
        </div>

        <StatusBar
          isDark={isDark}
          selectedLanguage={selectedLanguage}
          linesCount={getCode().split("\n").length}
          charsCount={getCode().length}
        />
      </div>
    </>
  );
}

export default App;
