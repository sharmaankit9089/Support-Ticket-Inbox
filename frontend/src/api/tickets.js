import api from "./axios";

export const fetchTickets = async ({ page, limit, status, priority, search }) => {
  const params = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (search) params.search = search;

  const res = await api.get("/tickets", { params });
  return res.data;
};
