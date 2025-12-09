"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { MdRefresh } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";

export const StepTwo = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    try {
      setIsGenerating(true);
      setResult(null);
      setErrorMsg(null);

      const res = await fetch("/api/gemini-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to analyze text");
      }

      setResult(data.ingredients ?? "No response from Gemini.");
    } catch (error) {
      setResult(null);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Алдаа гарлаа. Дараа дахин оролдоно уу."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuSparkles className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              Ingredient recognition
            </h2>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reset"
            onClick={handleReset}
          >
            <MdRefresh className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Describe the food, and AI will detect the ingredients.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Орц тодорхойлох"
        className="w-full min-h-[120px] text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />

      <div className="flex gap-3 justify-end">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !input.trim()}
          className="bg-gray-500 text-white"
        >
          {isGenerating ? (
            <>
              <MdRefresh className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      <section className="mt-2 space-y-2">
        <h3 className="text-base font-medium flex flex-wrap items-center gap-1">
          <FaRegFileAlt />
          Identified Ingredients
        </h3>
        <div className="border-none rounded-md text-sm whitespace-pre-line min-h-20">
          {!result && !isGenerating && (
            <span className="text-gray-500">
              First, enter your text to recognize an ingredients.
            </span>
          )}
          {isGenerating && <span>Working ...</span>}
          {result && !isGenerating && <p className="text-gray-700">{result}</p>}
        </div>
      </section>
    </div>
  );
};
