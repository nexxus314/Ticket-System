import { useState, useEffect } from "react";

export default function AdminDashboard({ token, logout }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  async function fetchAllTickets() {
    const res = await fetch("http://localhost:5000/tickets/total", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
  }

  async function updateStatus(id, status) {
    await fetch(`http://localhost:5000/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchAllTickets();
  }

  return (
    <div className="min-h-screen p-4 bg-slate-50">
      <div><h1 className="bg-black">TICKET SUPPORT</h1></div>
      <div className="app-inner bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <button
            onClick={logout}
            className="text-sm text-slate-600 hover:text-slate-800"
          >
            Logout
          </button>
        </div>

        {tickets.length === 0 && <p className="text-sm text-slate-500">No tickets found</p>}

        <ul className="space-y-3 mt-4">
          {tickets.map((t) => (
            <li
              key={t.id}
              className="p-3 border border-slate-100 rounded flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-slate-500">{t.description}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-slate-600">{t.status}</div>
                <button
                  onClick={() => updateStatus(t.id, "PENDING")}
                  className="text-xs px-2 py-1 bg-yellow-100 rounded"
                >
                  Pending
                </button>
                <button
                  onClick={() => updateStatus(t.id, "CLOSED")}
                  className="text-xs px-2 py-1 bg-rose-100 rounded"
                >
                  Close
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}