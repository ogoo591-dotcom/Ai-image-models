"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { MdRefresh } from "react-icons/md";
import { ImageUpload } from "./ImageUpload";
import { FaRegFileAlt } from "react-icons/fa";

export const StepOne = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files?.[0]) {
      setSelectedFile(event.target.files?.[0]);
      setResult(null);
    }
  };
  const handleGenerate = async () => {
    if (!selectedFile) return;
    try {
      setIsGenerating(true);
      setResult(null);

      const form = new FormData();
      form.append("image", selectedFile);

      const res = await fetch("/api/object-detection", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to analyze image");
      }

      const objects = (data.objects || []) as {
        label: string;
      }[];

      const labels = objects.map((cur) => cur.label);

      setResult(
        labels.length
          ? labels.join(",")
          : "No ingredients/objects were confidently detected."
      );
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuSparkles className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              Image analysis
            </h2>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reset"
            onClick={() => {
              setSelectedFile(null);
              setResult(null);
            }}
          >
            <MdRefresh className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-slate-600">
          Upload a food photo, and AI will detect the ingredients.
        </p>
        <ImageUpload
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
        />
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating}
            className="bg-gray-900 text-white"
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
      </div>

      <section className="mt-2 space-y-2 bg-gray-50 p-3 rounded-lg">
        <h3 className="text-base font-medium flex flex-wrap items-center gap-1">
          <FaRegFileAlt />
          Here is the summary
        </h3>
        <div className="border-none rounded-md  text-sm whitespace-pre-line min-h-6">
          {!result && !isGenerating && (
            <span className="text-gray-500">
              First, upload your image to recognize its ingredients.
            </span>
          )}
          {isGenerating && <span>Working ...</span>}
          {result && !isGenerating && <p className="text-gray-700">{result}</p>}
        </div>
      </section>
    </div>
  );
};
