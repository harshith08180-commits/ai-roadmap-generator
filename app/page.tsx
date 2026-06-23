"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!goal.trim()) return;

    try {
      setLoading(true);
      setRoadmap("");

      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });

      const data = await response.json();

      if (data.roadmap) {
        setRoadmap(data.roadmap);
      } else {
        setRoadmap(data.error || "Failed to generate roadmap.");
      }
    } catch (error) {
      console.error(error);
      setRoadmap("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyRoadmap = () => {
    navigator.clipboard.writeText(roadmap);
    alert("Roadmap copied!");
  };

  // 👇 Step 1: downloadRoadmap placed RIGHT below copyRoadmap
  const downloadRoadmap = () => {
    const blob = new Blob([roadmap], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-green-400 mb-8">
          AI Roadmap Generator
        </h1>

        <div className="flex gap-4">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Become an AI Engineer"
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 p-4 text-lg outline-none"
          />

          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="rounded-lg bg-green-500 px-8 py-4 font-bold hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>

        {roadmap && (
          <div className="mt-8 rounded-xl bg-gray-800 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-400">
                Your Roadmap
              </h2>

              {/* 👇 Step 2: Both buttons sit side by side in a flex div */}
              <div className="flex gap-2">
                <button
                  onClick={copyRoadmap}
                  className="rounded bg-blue-500 px-4 py-2 font-semibold hover:bg-blue-600"
                >
                  Copy
                </button>

                <button
                  onClick={downloadRoadmap}
                  className="rounded bg-purple-500 px-4 py-2 font-semibold hover:bg-purple-600"
                >
                  Download
                </button>
              </div>
            </div>

            {/* 👇 Step 3: ReactMarkdown renders the roadmap content */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}