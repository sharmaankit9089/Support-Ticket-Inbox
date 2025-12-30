import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTickets } from "../api/tickets";
import TicketDetail from "./TicketDetail";
import { useNavigate } from "react-router-dom";

const statusColors = {
  open: "bg-red-100 text-red-700",
  pending: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
};

const priorityColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
};

const Inbox = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["tickets", page, status, priority, search],
    queryFn: () =>
      fetchTickets({ page, limit: 10, status, priority, search }),
    refetchInterval: 10000,
    keepPreviousData: true,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between items-center mb-6">
          <div className="bg-[#5389f5] text-white px-4 py-2 rounded-lg text-lg font-semibold">
            Ticket Inbox
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="bg-[#f65c5c] text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2"
            value={priority}
            onChange={(e) => {
              setPage(1);
              setPriority(e.target.value);
            }}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            className="border rounded-lg px-3 py-2 flex-1"
            placeholder="Search…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {isLoading && (
          <p className="text-gray-500 text-sm mb-2">Loading tickets…</p>
        )}

        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Priority</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((t) => (
              <tr
                key={t.id}
                onClick={() => setSelectedTicket(t.id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="p-3">{t.title}</td>
                <td className="p-3">{t.customer_email}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${statusColors[t.status]}`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${priorityColors[t.priority]}`}
                  >
                    {t.priority}
                  </span>
                </td>
              </tr>
            ))}

            {data?.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-gray-500"
                >
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={data && data.length < 10}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedTicket && (
        <TicketDetail
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default Inbox;
