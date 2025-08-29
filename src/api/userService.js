const USER_API_BASE_URL = "http://localhost:9899/api/users";

export const getAllUsers = async () => {
  try {
    const response = await fetch(USER_API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await fetch(`${USER_API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getUsersByRole = async (role) => {
  try {
    const response = await fetch(`${USER_API_BASE_URL}/role/${role}`);
    if (!response.ok) throw new Error('Failed to fetch users by role');
    return await response.json();
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(USER_API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${USER_API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${USER_API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const searchUsers = async (searchTerm) => {
  try {
    // This would need backend support for search
    const users = await getAllUsers();
    return users.filter(user => 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};