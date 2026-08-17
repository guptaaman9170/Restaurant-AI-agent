const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/*
 * Parse Server-Sent Events coming from the backend.
 */
const parseSSEEvent = (rawEvent) => {
  const lines = rawEvent.split("\n");

  let event = "message";
  let data = "";

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    }

    if (line.startsWith("data:")) {
      data += line.slice(5).trim();
    }
  }

  if (!data) {
    return null;
  }

  try {
    return {
      event,
      data: JSON.parse(data),
    };
  } catch {
  console.error(
    "Failed to parse SSE data:",
    data
  );

  return null;
}
};

const requestResearch = async (
  message,
  onProgress,
  location = null
) => {
  const response = await fetch(
    `${API_BASE_URL}/research`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },

      body: JSON.stringify({
        message,

        /*
         * Optional browser location.
         *
         * If the user does not enable GPS,
         * this will be null.
         */
        location: location
          ? {
              latitude:
                location.latitude,

              longitude:
                location.longitude,

              accuracy:
                location.accuracy ??
                null,
            }
          : null,
      }),
    }
  );

  /*
   * If the server rejected the request before
   * starting SSE, it will usually return JSON.
   */
  if (!response.ok) {
    let errorMessage =
      "Failed to start research";

    try {
      const data =
        await response.json();

      errorMessage =
        data?.error?.message ||
        errorMessage;
    } catch {
      // Ignore JSON parsing failure.
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error(
      "Streaming response is not supported by this browser."
    );
  }

  /*
   * ------------------------------------------------
   * READ SSE STREAM
   * ------------------------------------------------
   */

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder("utf-8");

  let buffer = "";
  let finalResponse = null;

  try {
    while (true) {
      const {
        value,
        done,
      } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(
        value,
        {
          stream: true,
        }
      );

      const events =
        buffer.split("\n\n");

      buffer =
        events.pop() || "";

      for (const rawEvent of events) {
        const parsed =
          parseSSEEvent(rawEvent);

        if (!parsed) {
          continue;
        }

        const {
          event,
          data,
        } = parsed;

        /*
         * RESEARCH STARTED
         */

        if (
          event ===
          "research_started"
        ) {
          onProgress?.({
            type: "started",
            ...data,
          });

          continue;
        }

        /*
         * LIVE RESEARCH PROGRESS
         */

        if (
          event ===
          "research_progress"
        ) {
          onProgress?.({
            type: "progress",
            ...data,
          });

          continue;
        }

        /*
         * FINAL RESEARCH RESULT
         */

        if (
          event ===
          "research_complete"
        ) {
          finalResponse =
            data?.data || null;

          onProgress?.({
            type: "complete",
            ...data,
          });

          continue;
        }

        /*
         * RESEARCH ERROR
         */

        if (
          event ===
          "research_error"
        ) {
          throw new Error(
            data?.error?.message ||
              "Research failed"
          );
        }
      }
    }

    /*
     * Process remaining buffered event.
     */

    if (buffer.trim()) {
      const parsed =
        parseSSEEvent(buffer);

      if (parsed) {
        if (
          parsed.event ===
          "research_complete"
        ) {
          finalResponse =
            parsed.data?.data ||
            null;
        }

        if (
          parsed.event ===
          "research_error"
        ) {
          throw new Error(
            parsed.data?.error?.message ||
              "Research failed"
          );
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  /*
   * Backend should always send
   * research_complete.
   */

  if (!finalResponse) {
    throw new Error(
      "Research stream ended before a final result was received."
    );
  }

  return {
    success: true,

    data: finalResponse,

    requestId:
      finalResponse.requestId,

    message:
      "Research completed successfully",
  };
};

const getResearch = async (
  requestId
) => {
  const response = await fetch(
    `${API_BASE_URL}/research/${requestId}`
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        "Failed to fetch research"
    );
  }

  return data;
};

export {
  requestResearch,
  getResearch,
};