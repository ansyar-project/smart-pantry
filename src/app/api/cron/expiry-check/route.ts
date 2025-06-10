import { NextRequest } from "next/server";
import { processExpiryAlerts } from "@/app/actions/alerts";

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await processExpiryAlerts();

    if (result.success) {
      return Response.json({
        success: true,
        processed: result.processed,
        timestamp: new Date().toISOString(),
      });
    } else {
      return Response.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cron job error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
