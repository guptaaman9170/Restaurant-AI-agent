const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const requestResearch = async (message) => {
  const response = await fetch(`${API_BASE_URL}/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Failed to start research"
    );
  }

  return data;
};

const getResearch = async (requestId) => {
  const response = await fetch(
    `${API_BASE_URL}/research/${requestId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Failed to fetch research"
    );
  }

  return data;
};

export {
  requestResearch,
  getResearch,
};