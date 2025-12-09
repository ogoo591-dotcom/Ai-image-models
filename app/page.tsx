"use client";
import React, { useState } from "react";

import { StepTwo } from "./component/StepTwo";
import { StepOne } from "./component/StepOne";
import { StepThree } from "./component/StepThree";
import ChatPage from "./component/chatbot";

type TabId = "image-analysis" | "ingredient-recognition" | "image-creator";

type AnalysisStatus = "idle" | "loading" | "success" | "error";

const TABS: { id: TabId; label: string }[] = [
  { id: "image-analysis", label: "Image analysis" },
  { id: "ingredient-recognition", label: "Ingredient recognition" },
  { id: "image-creator", label: "Image creator" },
];

export const AiToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("image-analysis");

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium">AI tools</h1>
        </header>
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-2">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm rounded-t-md border border-b-0 ${
                    isActive
                      ? "bg-white font-medium border-gray-200"
                      : "bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {activeTab === "image-analysis" && <StepOne />}
          {activeTab === "ingredient-recognition" && <StepTwo />}
          {activeTab === "image-creator" && <StepThree />}
        </div>
        <div className="flex justify-end mt-150">
          <ChatPage />
        </div>
      </div>
    </div>
  );
};
export default AiToolsPage;
