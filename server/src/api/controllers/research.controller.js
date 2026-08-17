const researchService = require("../../modules/research/research.service");

const sendSSE = (res, event, data) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const startResearch = async (req, res, next) => {
  try {
    const {
      message,
      location,
    } = req.validated.body;

    /*
     * ------------------------------------------------
     * SSE HEADERS
     * ------------------------------------------------
     */

    res.status(200);

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    if (
      typeof res.flushHeaders ===
      "function"
    ) {
      res.flushHeaders();
    }

    sendSSE(
      res,
      "research_started",
      {
        requestId:
          req.requestId,
        status: "running",
        startedAt:
          new Date().toISOString(),
      }
    );

    /*
     * ------------------------------------------------
     * RUN RESEARCH + STREAM PROGRESS
     * ------------------------------------------------
     */

    const result =
      await researchService.startResearch({
        message,
        location,
        requestId:
          req.requestId,

        onProgress: (
          progress
        ) => {
          if (
            res.writableEnded
          ) {
            return;
          }

          sendSSE(
            res,
            "research_progress",
            progress
          );
        },
      });

    /*
     * ------------------------------------------------
     * FINAL RESULT
     * ------------------------------------------------
     */

    if (
      !res.writableEnded
    ) {
      sendSSE(
        res,
        "research_complete",
        {
          requestId:
            req.requestId,
          status:
            "completed",
          data: result,
          completedAt:
            new Date().toISOString(),
        }
      );

      sendSSE(
        res,
        "done",
        {
          requestId:
            req.requestId,
        }
      );

      res.end();
    }
  } catch (error) {
    if (res.headersSent) {
      if (
        !res.writableEnded
      ) {
        sendSSE(
          res,
          "research_error",
          {
            requestId:
              req.requestId,
            status: "failed",
            error: {
              code:
                error.code ||
                "RESEARCH_FAILED",
              message:
                error.message ||
                "Research failed",
            },
          }
        );

        sendSSE(
          res,
          "done",
          {
            requestId:
              req.requestId,
          }
        );

        res.end();
      }

      return;
    }

    next(error);
  }
};

const getResearch = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const result =
      await researchService.getResearch(
        requestId
      );

    return res.status(200).json({
      success: true,
      data: result,
      message:
        "Research retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startResearch,
  getResearch,
};