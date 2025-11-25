import React, { useState } from "react";

function App() {
  const [post, setPost] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setPreview("");
    try {
      const res = await fetch("https://hook.make.com/your-webhook-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post }),
      });
      if (!res.ok) throw new Error("Webhook request failed");
      const data = await res.json();
      setPreview(data.aiSuggestion || "No suggestion returned.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Automate Your LinkedIn Posts</h1>
        <p className="text-xl mb-6">AI-driven post suggestions & effortless scheduling</p>
        <button
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          onClick={() => document.getElementById("demo").scrollIntoView({ behavior: "smooth" })}
        >
          Try It Now
        </button>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-10">
          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h3 className="font-bold mb-2">1. Connect</h3>
            <p>Link your LinkedIn account securely to start automation.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h3 className="font-bold mb-2">2. Draft & Preview</h3>
            <p>Paste your post and get AI suggestions instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h3 className="font-bold mb-2">3. Schedule & Post</h3>
            <p>Schedule posts effortlessly, and let automation handle the rest.</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="py-16 px-6 bg-gray-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">AI Post Preview</h2>
          <textarea
            className="w-full p-4 rounded-lg border border-gray-300 mb-4 text-gray-700"
            rows="5"
            placeholder="Type your LinkedIn post here..."
            value={post}
            onChange={(e) => setPost(e.target.value)}
          ></textarea>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            disabled={loading || !post}
          >
            {loading ? "Generating..." : "Generate & Preview"}
          </button>

          {error && <p className="text-red-600 mt-4">{error}</p>}

          {preview && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md text-left">
              <h3 className="font-bold mb-2">AI Suggestion:</h3>
              <p>{preview}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500">
        &copy; {new Date().getFullYear()} LinkedIn Automation. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
