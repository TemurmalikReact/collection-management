import { useCallback, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useHttp } from "./http.hook";

const collection_userData = "collection_userData";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const { request } = useHttp();

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);

    localStorage.setItem(
      collection_userData,
      JSON.stringify({
        token: jwtToken,
        userId: id,
      })
    );

    return <Redirect to="/" />;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);

    localStorage.removeItem(collection_userData);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const storage = JSON.parse(localStorage.getItem(collection_userData));

      if (storage && storage.token && storage.userId) {
        const data = await request(`/api/users/${storage.userId}`, "GET");

        if (data && !data.isBlocked) {
          login(storage.token, storage.userId);
        }
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }, [login, request]);

  useEffect(() => {
    fetchData();
  }, [fetchData, login]);

  return { login, logout, token, userId, loading };
};
