"use client";

import { useState } from "react";

interface ResumeTweak {
  original_resume_bullet: string;
  suggested_revision: string;
  reasoning: string;
}

interface ResultsData {
  cover_letter: string;
  ats_resume_tweaks: ResumeTweak[];
  missing_keywords: string[];
}

interface ResultsProps {
  data: ResultsData;
  onReset: () => void;
}

export default function Results({ data, onReset }: ResultsProps) {
  const [activeTab, setActiveTab] = useState<"cover" | "resume" | "keywords">(
    "cover"
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Tailored Results
            </h1>
            <p className="text-gray-600">
              Optimized for ATS and job-specific requirements
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            {[
              { id: "cover", label: "Cover Letter" },
              { id: "resume", label: "Resume Tweaks" },
              { id: "keywords", label: "Missing Keywords" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-96">
            {/* Cover Letter Tab */}
            {activeTab === "cover" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Tailored Cover Letter
                    </h2>
                    <button
                      onClick={() => copyToClipboard(data.cover_letter, 0)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                    >
                      {copiedIndex === 0 ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {data.cover_letter}
                  </p>
                </div>
              </div>
            )}

            {/* Resume Tweaks Tab */}
            {activeTab === "resume" && (
              <div className="space-y-4">
                {data.ats_resume_tweaks.length > 0 ? (
                  data.ats_resume_tweaks.map((tweak, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                          Original
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                          {tweak.original_resume_bullet}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-green-600 uppercase mb-2">
                          Suggested Revision
                        </h3>
                        <div className="flex justify-between items-start">
                          <p className="text-gray-700 bg-green-50 p-3 rounded flex-1">
                            {tweak.suggested_revision}
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(tweak.suggested_revision, index)
                            }
                            className="ml-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition whitespace-nowrap"
                          >
                            {copiedIndex === index ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">
                          Why This Works
                        </h3>
                        <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded">
                          {tweak.reasoning}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No resume tweaks suggested.</p>
                )}
              </div>
            )}

            {/* Keywords Tab */}
            {activeTab === "keywords" && (
              <div className="space-y-4">
                {data.missing_keywords.length > 0 ? (
                  <div>
                    <p className="text-gray-700 mb-4">
                      Add these keywords to your resume for better ATS matching:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.missing_keywords.map((keyword, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            copyToClipboard(keyword, index + 100)
                          }
                          className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                            copiedIndex === index + 100
                              ? "bg-green-600 text-white"
                              : "bg-yellow-100 text-yellow-900 hover:bg-yellow-200"
                          }`}
                        >
                          {copiedIndex === index + 100 ? "✓" : ""} {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No missing keywords identified.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onReset}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
            >
              Generate Another Resume
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">📝 Cover Letter</h3>
            <p className="text-sm text-gray-600">
              Personalize and customize before sending. Add specific details about
              your interest in the company.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">💼 Resume Tweaks</h3>
            <p className="text-sm text-gray-600">
              Update your resume with the suggested revisions to improve ATS
              compatibility and job relevance.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">🔑 Keywords</h3>
            <p className="text-sm text-gray-600">
              Incorporate missing keywords naturally throughout your resume and
              cover letter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
