
import React, { useState } from "react";

// TODO: replace with your real Make webhook
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/pa3yh9u61rgv9sviq1t7sgengr5b4epq";

export default function App() {
  const [post, setPost] = useState("");
  const [option, setOption] = useState("direct"); // 'direct' | 'schedule' | 'ai'
  const [scheduledTime, setScheduledTime] = useState(""); // datetime-local value
  const [userId, setUserId] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    setError("");
    if (!userId) return "Please enter your email or user id.";
    if (option === "schedule" && !scheduledTime) return "Please pick a date and time to schedule.";
    if (option !== "ai" && !post) return "Please enter the post content.";
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setStatusMsg("");
    setPreview("");

    const payload = {
      post: post || "", // could be empty for AI generation if you want
      option, // 'direct' | 'schedule' | 'ai'
      scheduledTime: scheduledTime ? new Date(scheduledTime).toISOString() : null,
      userId,
      source: "react-landing", // helpful metadata for Make/Airtable
    };

    try {
      const res = await fetch(MAKE_WEBHOOK_URL, {
        // CORS validation: ensure the endpoint is reachable
        mode: "cors",  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),

        // mode: "cors",MAKE_WEBHOOK_URL, {

        // method: "POST",
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Make webhook error: ${res.status} ${text}`);
      }

      // Some Make webhook setups respond with JSON immediately (recommended)
      const data = await res.json().catch(() => null);

      // Handle response based on chosen option
      if (option === "ai") {
        const aiSuggestion = data?.aiSuggestion || data?.suggestion || "(No suggestion returned)";
        setPreview(aiSuggestion);
        setStatusMsg("AI suggestion received — saved to your Airtable record.");
      } else if (option === "schedule") {
        setStatusMsg("Post scheduled — check Airtable for details.");
      } else {
        setStatusMsg("Post submitted for immediate publishing.");
      }

      // Optionally clear post only for direct posted items
      // setPost("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* HERO */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Automate Your LinkedIn, with AI & Make</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Draft, generate, schedule, and publish LinkedIn posts — all workflows recorded to Airtable and executed
            by Make.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#demo" className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:opacity-95">
              Try the Demo
            </a>
            <a
              href="#features"
              className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white/10"
            >
              How it works
            </a>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">1 — Choose</h3>
              <p className="text-sm text-gray-600">Direct post, schedule a future post, or ask OpenAI to generate content.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">2 — Make maps to Airtable</h3>
              <p className="text-sm text-gray-600">Every action creates/updates a record in your Airtable base for tracking and auditing.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">3 — LinkedIn handles publishing</h3>
              <p className="text-sm text-gray-600">Make triggers the LinkedIn module to post immediately or at the scheduled time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO / INTERACTIVE */}
      <section id="demo" className="py-12 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Interactive Post Studio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <label className="md:col-span-1 flex flex-col">
                  <span className="text-sm font-medium mb-2">Your identity</span>
                  <input
                    type="text"
                    placeholder="you@company.com or username"
                    className="border p-2 rounded"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <span className="text-xs text-gray-400 mt-1">Used to map records in Airtable</span>
                </label>

                <label className="md:col-span-2 flex flex-col">
                  <span className="text-sm font-medium mb-2">Post content</span>
                  <textarea
                    className="border p-3 rounded min-h-[120px] resize-none"
                    placeholder="Write your LinkedIn post here (or leave empty if asking AI to generate)"
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-3">
                  <label className={`px-3 py-2 rounded cursor-pointer ${option === 'direct' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                    <input
                      type="radio"
                      name="option"
                      value="direct"
                      checked={option === "direct"}
                      onChange={() => setOption("direct")}
                      className="hidden"
                    />
                    <span className="ml-2">Post Directly</span>
                  </label>

                  <label className={`px-3 py-2 rounded cursor-pointer ${option === 'schedule' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                    <input
                      type="radio"
                      name="option"
                      value="schedule"
                      checked={option === "schedule"}
                      onChange={() => setOption("schedule")}
                      className="hidden"
                    />
                    <span className="ml-2">Schedule</span>
                  </label>

                  <label className={`px-3 py-2 rounded cursor-pointer ${option === 'ai' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                    <input
                      type="radio"
                      name="option"
                      value="ai"
                      checked={option === "ai"}
                      onChange={() => setOption("ai")}
                      className="hidden"
                    />
                    <span className="ml-2">Generate with AI</span>
                  </label>
                </div>

                <div className="flex-1">
                  {option === "schedule" && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm mr-2">Pick date & time</label>
                      <input
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="border p-2 rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded font-semibold disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : option === 'ai' ? 'Generate' : option === 'schedule' ? 'Schedule Post' : 'Post Now'}
                </button>

                <button
                  type="button"
                  className="border px-4 py-2 rounded"
                  onClick={() => {
                    setPost("");
                    setScheduledTime("");
                    setPreview("");
                    setStatusMsg("");
                    setError("");
                  }}
                >
                  Reset
                </button>

                <div className="ml-auto text-sm text-gray-500">Source: <span className="font-mono">React → Make → Airtable → LinkedIn</span></div>
              </div>
            </form>

            {/* STATUS & PREVIEW */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-semibold mb-2">Status</h4>
                {error && <p className="text-red-600">{error}</p>}
                {statusMsg && <p className="text-green-600">{statusMsg}</p>}
                {!statusMsg && !error && <p className="text-gray-600">No actions yet — submit a post to begin.</p>}
              </div>

              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-semibold mb-2">Preview / AI Suggestion</h4>
                {option === 'ai' && preview && (
                  <div className="p-3 bg-white rounded shadow-sm">
                    <p>{preview}</p>
                  </div>
                )}

                {option !== 'ai' && (
                  <div className="p-3 bg-white rounded shadow-sm">
                    <p className="whitespace-pre-wrap">{post || "(No content)"}</p>
                    {option === 'schedule' && scheduledTime && (
                      <p className="mt-2 text-xs text-gray-500">Scheduled for: {new Date(scheduledTime).toLocaleString()}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* TRACE / RAW PAYLOAD - useful for testing */}
            <details className="mt-6 p-4 bg-gray-50 rounded border">
              <summary className="cursor-pointer font-medium">Debug / Raw Payload</summary>
              <pre className="mt-3 text-xs text-gray-700 p-2 bg-white rounded overflow-auto">{JSON.stringify({ post, option, scheduledTime, userId }, null, 2)}</pre>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-500">
        <div className="max-w-4xl mx-auto px-6">
          <p className="mb-2">Built with ❤️ — React + Tailwind + Make</p>
          <p className="text-xs">Replace <span className="font-mono">MAKE_WEBHOOK_URL</span> in the code with your Make webhook URL.</p>
        </div>
      </footer>
    </div>
  );
}
