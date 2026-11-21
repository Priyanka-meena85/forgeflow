import Stripe from "stripe";

// Initialize Stripe singleton with environment variable or fallback
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});
