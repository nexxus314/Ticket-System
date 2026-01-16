import { useState, useEffect } from "react";

export default function UserDashboard({ token, logout }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchMyTickets();
  }, []);

  async function fetchMyTickets() {
    const res = await fetch("http://localhost:5000/tickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
  }

  async function createTicket() {
    await fetch("http://localhost:5000/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    fetchMyTickets();
  }

  return (
    <div className="min-h-screen p-4 bg-slate-50">
      <div className="app-inner bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Tickets</h2>
          <button
            onClick={logout}
            className="text-sm text-slate-600 hover:text-slate-800"
          >
            Logout
          </button>
        </div>

        <div className="mb-4">
          <input
            className="w-full border border-slate-200 rounded px-3 py-2 mb-2 text-sm"
            placeholder="Ticket Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full border border-slate-200 rounded px-3 py-2 mb-2 text-sm"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={createTicket}
            className="mt-2 bg-slate-900 text-white rounded px-3 py-2 text-sm"
          >
            Create Ticket
          </button>
        </div>

        <ul className="space-y-3">
          {tickets.map((t) => (
            <li
              key={t.id}
              className="p-3 border border-slate-100 rounded flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-slate-500">{t.description}</div>
              </div>
              <div className="text-sm text-slate-600">
                {t.status ?? "OPEN"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}