
import { useCallback } from "react";
import NavBar from "./NavBar.jsx";
import useSSE from "../hooks/useSSE.js";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function AppShell({ children }) {
  const { dispatch } = useNotifications();

  const handleMessage = useCallback(
    (data) => {
      if (data.type === "connected") return;

      dispatch({
        type: "ADD_NOTIFICATION",
        payload: data,
      });
    },
    [dispatch]
  );

  useSSE("/api/notifications/stream", handleMessage);

  return (
    <div>
      <NavBar />
      <main style={{ padding: "1.5rem" }}>
        {children}
      </main>
    </div>
  );
}
