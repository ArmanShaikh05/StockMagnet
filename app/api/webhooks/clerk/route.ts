import db from "@/lib/prisma";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server"; // <- for type narrowing

export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req)) as WebhookEvent;

    const eventType = evt.type;

    const user = evt.data as UserJSON;

    if (
      !user.first_name ||
      !user.last_name ||
      !user.email_addresses[0].email_address
    ) {
      return new Response("Error: User data is missing", { status: 404 });
    }

    if (eventType === "user.created") {
      await db.user.create({
        data: {
          clerkUserId: user.id,
          email: user.email_addresses[0].email_address,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    }

    if (eventType === "user.updated") {
      await db.user.update({
        where: {
          clerkUserId: user.id,
        },
        data: {
          clerkUserId: user.id,
          email: user.email_addresses[0].email_address,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    }

    return new Response("User managed successfully", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
