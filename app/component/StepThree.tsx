"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { MdRefresh } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";

export const StepThree = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUrl(null);

    try {
      const data = await (
        await fetch("/api/text-to-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })
      ).json();

      if (data.error) {
        console.error(data.error);
      } else if (data.image) {
        setImageUrl(data.image);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuSparkles className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              Food image creator
            </h2>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reset"
            onClick={() => {
              setPrompt("");
              setImageUrl(null);
            }}
          >
            <MdRefresh className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          What food image do you want? Describe it briefly.
        </p>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Хоолны тайлбар"
        className="w-full min-h-[120px] text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <div className="flex gap-3 justify-end">
        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="bg-gray-500 text-white"
        >
          {loading ? (
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
          <CiImageOn />
          Result
        </h3>{" "}
        <div className="border-none rounded-md text-sm whitespace-pre-line min-h-20">
          {!loading && !imageUrl && (
            <span className="text-gray-500">
              First, enter your text to generate an image.
            </span>
          )}
          {loading && <span>Working on your image just wait for moment</span>}
          {imageUrl && (
            <div className="mt-6">
              <img
                src={imageUrl}
                alt="Generated"
                className="max-w-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
