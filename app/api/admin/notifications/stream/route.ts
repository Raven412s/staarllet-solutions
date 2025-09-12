import { connectToDb } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
  await connectToDb();

  // Create a stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Initial notifications
      const existing = await Notification.find().sort({ createdAt: -1 }).limit(20);
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(existing)}\n\n`)
      );

      // --- CHANGE STREAM ---
      const changeStream = Notification.watch([], { fullDocument: "updateLookup" });

      changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
          const doc = change.fullDocument;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify([doc])}\n\n`)
          );
        } else if (change.operationType === "delete") {
          controller.enqueue(
            encoder.encode(`event: delete\ndata: ${JSON.stringify({ _id: change.documentKey._id })}\n\n`)
          );
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
