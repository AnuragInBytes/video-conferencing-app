import api from "./api";

export const refreshAccessToken = async () => {
  try {
    const response = await api.post('/users/refresh-token');
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("failed to refresh token :", error);
      throw error;
  }
};