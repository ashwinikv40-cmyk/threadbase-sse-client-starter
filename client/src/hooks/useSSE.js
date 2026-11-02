
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default function useSSE(url, onMessage) {
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;
``  
    const controller = new AbortController();

    class FatalSSEError extends Error {}

    fetchEventSource(url, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      signal: controller.signal,
      openWhenHidden: true,

      async onopen(response) {
        if (!response.ok) {
          throw new FatalSSEError(
            `SSE connection failed: ${response.status}`
          );
        }

        if (
          !response.headers
            .get("content-type")
            ?.includes("text/event-stream")
        ) {
          throw new FatalSSEError("Invalid SSE response");
        }

        console.log("SSE connection established!");
      },

      onmessage(event) {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("SSE parsing error:", error);
        }
      },

      onerror(error) {
        console.error("SSE connection error:", error);

        if (error instanceof FatalSSEError) {
          throw error;
        }
      },
    }).catch((error) => {
      if (error.name !== "AbortError") {
        console.error("SSE stopped:", error);
      }
    });

    return () => controller.abort();
  }, [url, user, token, onMessage]);
}
