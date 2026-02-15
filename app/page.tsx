"use client";
import { useState } from "react";
import { createTinyLink } from "./lib/api";
import { Link, Copy, Check, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [tinyUrl, setTinyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTinyUrl("");
    setCopied(false);
    try {
      const data = await createTinyLink(originalUrl);
      setTinyUrl(data.tinyUrl);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create tiny link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (tinyUrl) {
      await navigator.clipboard.writeText(tinyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-lg z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Tiny Link{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Generator
            </span>
          </h1>
          <p className="text-slate-500 text-lg">
            Shorten your long URLs into shareable links in seconds.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-indigo-100/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link
                  className={`w-5 h-5 transition-colors duration-200 ${originalUrl ? "text-indigo-500" : "text-slate-400"}`}
                />
              </div>
              <input
                type="url"
                placeholder="Paste your long link here..."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Shortening...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Generate Tiny Link
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          {/* Result Section */}
          {tinyUrl && (
            <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Your Tiny Link
              </label>
              <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <input
                  readOnly
                  value={tinyUrl}
                  className="flex-1 bg-transparent px-3 text-slate-700 font-medium outline-none truncate"
                />
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-white text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
