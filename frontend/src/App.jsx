import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:3000/identify", {
        email: email || null,
        phoneNumber: phone || null,
      });
      setResult(res.data);
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🔍 Bitespeed Identity Resolver
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Enter Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter Phone Number"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Processing..." : "Identify"}
          </button>

          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <h2 className="font-semibold mb-2 text-gray-700">
                Consolidated Contact:
              </h2>
              <pre className="text-sm text-gray-800 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;