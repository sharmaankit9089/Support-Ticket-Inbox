import api from "./axios";

export const fetchTicketById = async (id) => {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
};

export const updateTicket = async ({ id, status, priority }) => {
  const res = await api.patch(`/tickets/${id}`, { status, priority });
  return res.data;
};

export const fetchNotes = async (ticketId) => {
  const res = await api.get(`/tickets/${ticketId}/notes`);
  return res.data;
};

export const addNote = async ({ ticketId, text }) => {
  const res = await api.post(`/tickets/${ticketId}/notes`, { text });
  return res.data;
};
