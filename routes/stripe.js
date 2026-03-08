const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const auth = require('../middleware/auth');
const Salon = require('../models/Salon');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ── GET /api/stripe/status ────────────────────────────────────────────────────
// Returns the current subscription status for the logged-in salon
router.get('/status', auth, async (req, res) => {
  try {
    const salon = await Salon.findById(req.salon._id).select(
      'subscriptionStatus trialEndsAt stripeSubscriptionId'
    );
    res.json({
      subscriptionStatus: salon.subscriptionStatus,
      trialEndsAt: salon.trialEndsAt,
    });
  } catch (error) {
    console.error('Stripe status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/stripe/create-checkout ─────────────────────────────────────────
// Creates a Stripe Checkout Session and returns the URL
router.post('/create-checkout', auth, async (req, res) => {
  try {
    const salon = await Salon.findById(req.salon._id);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: salon.stripeCustomerId || undefined,
      customer_email: salon.stripeCustomerId ? undefined : salon.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL || 'https://laseria.app/success',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'https://laseria.app/cancel',
      metadata: { salonId: salon._id.toString() },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ message: 'Could not create checkout session' });
  }
});

// ── POST /api/stripe/webhook ──────────────────────────────────────────────────
// Stripe sends events here — must use raw body (configured in server.js)
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const subscription = event.data.object;

  // Helper to find salon by Stripe customer ID
  const findSalon = async (customerId) =>
    Salon.findOne({ stripeCustomerId: customerId });

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const salon = await findSalon(subscription.customer);
        if (salon) {
          salon.stripeSubscriptionId = subscription.id;
          salon.subscriptionStatus = subscription.status; // active, trialing, past_due, canceled
          await salon.save();
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const salon = await findSalon(subscription.customer);
        if (salon) {
          salon.subscriptionStatus = 'canceled';
          await salon.save();
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const salon = await findSalon(invoice.customer);
        if (salon) {
          salon.subscriptionStatus = 'active';
          await salon.save();
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const salon = await findSalon(invoice.customer);
        if (salon) {
          salon.subscriptionStatus = 'past_due';
          await salon.save();
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  res.json({ received: true });
});

module.exports = router;
