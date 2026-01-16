import { useState } from "react";

export default function Login({ setToken, setRole, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      setRole(data.role || "user");
    } else {
      alert("Login failed");
    }
  }

  return (
    
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

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
          onClick={handleLogin}
          className="w-full bg-slate-900 text-white rounded px-3 py-2 text-sm hover:bg-slate-800"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Don’t have an account?{' '}
          <button className="text-sky-600" onClick={() => setPage("signup")}>{"Signup"}</button>
        </p>
      </div>
    </div>
  );
}
