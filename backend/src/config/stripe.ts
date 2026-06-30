console.log("Stripe config file loaded");
import dotenv from "dotenv";
dotenv.config();

console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export default stripe;