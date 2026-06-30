import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../config/stripe";
import Invoice from "../models/Invoice";

// export const stripeWebhook = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const sig = req.headers["stripe-signature"] as string;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET as string
//     );
//   } catch (err: any) {
//     console.error("Webhook Signature Error:", err.message);

//     res.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;

//     const invoiceId = session.metadata?.invoiceId;

//     if (invoiceId) {
//       await Invoice.findByIdAndUpdate(invoiceId, {
//         status: "paid",
//       });

//       console.log(`Invoice ${invoiceId} marked as paid.`);
//     }
//   }

//   res.status(200).json({
//     received: true,
//   });
// };
export const stripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook Signature Error:", err.message);

    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("========== WEBHOOK RECEIVED ==========");
  console.log("Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Session ID:", session.id);
    console.log("Metadata:", session.metadata);

    const invoiceId = session.metadata?.invoiceId;

    console.log("Invoice ID:", invoiceId);

    if (invoiceId) {
      const updated = await Invoice.findByIdAndUpdate(
        invoiceId,
        {
          status: "paid",
        },
        { new: true }
      );

      console.log("Updated Invoice:", updated);
    }
  }

  res.status(200).json({
    received: true,
  });
};