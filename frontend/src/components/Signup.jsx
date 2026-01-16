import { useState } from "react";

export default function Signup({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const res = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Do not send a client-controlled `role`—server will assign role based on ADMIN_SECRET
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Signup successful. Please login.");
      setPage("login");
    } else {
      alert("Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Signup</h2>

        <input
          className="w-full border border-slate-200 rounded px-3 py-2 mb-3 text-sm"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border border-slate-200 rounded px-3 py-2 mb-4 text-sm"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-slate-900 text-white rounded px-3 py-2 text-sm hover:bg-slate-800"
        >
          Signup
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <button className="text-sky-600" onClick={() => setPage("login")}>{"Login"}</button>
        </p>
      </div>
    </div>
  );
}
