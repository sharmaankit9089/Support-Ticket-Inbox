import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTicketById,
  updateTicket,
  fetchNotes,
  addNote,
} from "../api/ticketDetails";
import { useState } from "react";

const TicketDetail = ({ ticketId, onClose }) => {
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");

  const { data: ticket } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => fetchTicketById(ticketId),
  });

  const { data: notes } = useQuery({
    queryKey: ["notes", ticketId],
    queryFn: () => fetchNotes(ticketId),
  });

  const updateMutation = useMutation({
    mutationFn: updateTicket,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(["tickets"]);

      const previousTickets = queryClient.getQueryData(["tickets"]);

      queryClient.setQueryData(["tickets"], (old) => {
        if (!old) return old;
        return old.map((t) =>
          t.id === newData.id
            ? { ...t, status: newData.status, priority: newData.priority }
            : t
        );
      });

      return { previousTickets };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(["tickets"], context.previousTickets);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["tickets"]);
      queryClient.invalidateQueries(["ticket", ticketId]);
    },
  });

  const noteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      setNoteText("");
      queryClient.invalidateQueries(["notes", ticketId]);
    },
  });

  if (!ticket) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Side Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">{ticket.title}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm bg-[#f65c5c] text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          <p className="text-sm text-gray-600 mb-2">
            <b>Email:</b> {ticket.customer_email}
          </p>

          {ticket.description && (
            <p className="text-sm text-gray-700 mb-4">
              {ticket.description}
            </p>
          )}

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={ticket.status}
                onChange={(e) =>
                  updateMutation.mutate({
                    id: ticketId,
                    status: e.target.value,
                    priority: ticket.priority,
                  })
                }
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={ticket.priority}
                onChange={(e) =>
                  updateMutation.mutate({
                    id: ticketId,
                    status: ticket.status,
                    priority: e.target.value,
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <h4 className="font-medium mb-2">Notes</h4>

          <div className="max-h-48 overflow-y-auto mb-3">
            {notes?.length === 0 && (
              <p className="text-sm text-gray-500">No notes yet</p>
            )}

            {notes?.map((note) => (
              <div
                key={note.id}
                className="bg-gray-100 rounded-lg p-2 mb-2 text-sm"
              >
                <b>{note.author}</b>: {note.text}
              </div>
            ))}
          </div>
        </div>

        {/* Add Note (Sticky Footer) */}
        <div className="border-t px-5 py-4">
          <input
            className="w-full border rounded-lg px-3 py-2 mb-2"
            placeholder="Add note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />

          <button
            disabled={!noteText.trim()}
            onClick={() =>
              noteMutation.mutate({ ticketId, text: noteText })
            }
            className="w-full bg-[#3014e8] text-white py-2 rounded-lg hover:bg-blue-900 disabled:opacity-80"
          >
            Add Note
          </button>
        </div>
      </div>
    </>
  );
};

export default TicketDetail;
