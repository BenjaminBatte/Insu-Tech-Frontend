const BASE_URL = "http://localhost:9092/api/managed-policies";

export const getManagedPolicies = async (role, username) => {
  const url = username
    ? `${BASE_URL}?role=${role}&username=${username}`
    : `${BASE_URL}?role=${role}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch managed policies");
  return response.json();
};

export const createManagedPolicy = async (policy) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!response.ok) throw new Error("Failed to create managed policy");
  return response.json();
};

export const deleteManagedPolicy = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete managed policy");
  return true;
};
