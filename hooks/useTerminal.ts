"use client";

// Hook terminal : état, historique, autocomplétion, commandes
// Choix : logique pure dans le hook pour découpler de l'UI

import { useState, useCallback, useRef } from "react";
import { terminalCommands } from "@/lib/terminal/commands";
import type { Lang } from "./useLang";

export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "system";
  content: string;
}

const COMMANDS = Object.keys(terminalCommands);

export function useTerminal(lang: Lang) {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = useCallback(
    (content: string, type: TerminalLine["type"] = "output") => {
      setLines((prev) => [
        ...prev,
        { id: crypto.randomUUID(), type, content },
      ]);
    },
    []
  );

  const openTerminal = useCallback(() => {
    setIsOpen(true);
    if (lines.length === 0) {
      const welcome =
        lang === "fr"
          ? "Bienvenue dans le terminal d'Issa. Tapez 'help' pour la liste des commandes."
          : "Welcome to Issa's terminal. Type 'help' for a list of commands.";
      addLine(welcome, "system");
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [lines.length, lang, addLine]);

  const closeTerminal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const execute = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (!trimmed) return;

      addLine(`$ ${cmd}`, "input");
      setHistory((prev) => [cmd, ...prev.slice(0, 49)]);
      setHistoryIndex(-1);

      if (trimmed === "clear") {
        setLines([]);
        return;
      }

      if (trimmed === "exit") {
        addLine(lang === "fr" ? "Au revoir." : "Goodbye.", "system");
        setTimeout(() => setIsOpen(false), 600);
        return;
      }

      const handler = terminalCommands[trimmed as keyof typeof terminalCommands];
      if (handler) {
        const output = handler(lang);
        if (Array.isArray(output)) {
          output.forEach((line) => addLine(line, "output"));
        } else {
          addLine(output, "output");
        }
      } else {
        const notFound =
          lang === "fr"
            ? `Commande non reconnue : '${trimmed}'. Tapez 'help'.`
            : `Command not found: '${trimmed}'. Type 'help'.`;
        addLine(notFound, "error");
      }
    },
    [lang, addLine]
  );

  // Navigation dans l'historique avec flèches
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const newIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex] ?? "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const newIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(newIndex);
        setInput(newIndex === -1 ? "" : (history[newIndex] ?? ""));
      } else if (e.key === "Tab") {
        // Autocomplétion sur Tab
        e.preventDefault();
        const matches = COMMANDS.filter((c) => c.startsWith(input.toLowerCase()));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          addLine(`$ ${input}`, "input");
          addLine(matches.join("  "), "output");
        }
      } else if (e.key === "Enter") {
        execute(input);
        setInput("");
      }
    },
    [historyIndex, history, input, execute, addLine]
  );

  return {
    isOpen,
    lines,
    input,
    setInput,
    inputRef,
    openTerminal,
    closeTerminal,
    handleKeyDown,
    execute,
  };
}
