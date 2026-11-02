import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export default function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const source = new EventSource(url, {
      withCredentials: true,
    });

    source.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    source.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    return () => source.close();
  }, [url, user, onMessage]);
}