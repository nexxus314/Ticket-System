import { useState, useEffect } from "react";
import Comments from "./Comments";

export default function AdminDashboard({ token, logout, userEmail }) {
  const [tickets, setTickets] = useState([]);
  const [expandedTicket, setExpandedTicket] = useState(null);

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

  async function removeTicket(id) {
    if (confirm("Are you sure you want to delete this ticket?")) {
      await fetch(`http://localhost:5000/tickets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAllTickets();
    }
  }

  return (
    <div className="min-h-screen p-4 bg-slate-50">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-6">Ticket Supporter</h1>
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
              key={t._id}
              className="p-3 border border-slate-100 rounded"
            >
              <div
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() =>
                  setExpandedTicket(
                    expandedTicket === t._id ? null : t._id
                  )
                }
              >
                <div className="flex-1">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-slate-500">{t.description}</div>
                  <div className="text-xs text-slate-400 mt-1">User ID: {t.userId}</div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <div className="text-sm text-slate-600">{t.status}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(t._id, "IN_PROGRESS");
                    }}
                    className="text-xs px-2 py-1 bg-yellow-100 rounded"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(t._id, "CLOSED");
                    }}
                    className="text-xs px-2 py-1 bg-rose-100 rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTicket(t._id);
                    }}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {expandedTicket === t._id && (
                <Comments
                  ticketId={t._id}
                  token={token}
                  userEmail={userEmail}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}