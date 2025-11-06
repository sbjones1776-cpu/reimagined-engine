// --- MongoDB User Model Setup ---
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mathadventure'); // Use your actual connection string

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  plan: String
}));
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
app.use(bodyParser.json());

// Square webhook signature key
const SQUARE_SIGNATURE_KEY = 'yq9xWcYi_ggb16fiU_Q9dA';

function verifySquareSignature(req) {
  const signature = req.headers['x-square-signature'];
  const body = JSON.stringify(req.body);
  const url = 'https://www.math-adventure.com/api/square/webhook'; // Must match your webhook URL exactly

  // Square signature: HMAC-SHA1 of (webhook URL + body), using signature key
  const hmac = crypto.createHmac('sha1', SQUARE_SIGNATURE_KEY);
  hmac.update(url + body);
  const expectedSignature = hmac.digest('base64');

  return signature === expectedSignature;
}

app.post('/api/square/webhook', (req, res) => {
  if (!verifySquareSignature(req)) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  console.log('Received Square event:', event);

  if (event.type === 'payment.created') {
    // Extract payment info
    const payment = event.data.object.payment;
    const buyerEmail = payment?.buyer_email_address;
    const plan = payment?.note;
    if (buyerEmail && plan) {
      User.findOneAndUpdate(
        { email: buyerEmail },
        { plan: plan },
        { new: true, upsert: true }
      ).then(user => {
        console.log(`Updated plan for ${buyerEmail} to ${plan}`);
      }).catch(err => {
        console.error('Error updating user plan:', err);
      });
    }
    console.log('Payment received:', payment);
  }
  // Handle payment failures
  if (event.type === 'payment.updated') {
    const payment = event.data.object.payment;
    if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
      const buyerEmail = payment?.buyer_email_address;
      if (buyerEmail) {
        User.findOneAndUpdate(
          { email: buyerEmail },
          { plan: 'none' },
          { new: true }
        ).then(user => {
          console.log(`Payment failed/canceled for ${buyerEmail}, plan set to none.`);
        }).catch(err => {
          console.error('Error updating user plan on failure:', err);
        });
      }
      console.log('Payment failure/cancellation:', payment);
    }
  }
  // Handle subscription cancellations
  if (event.type === 'subscription.updated') {
    const subscription = event.data.object.subscription;
    if (subscription.status === 'CANCELED') {
      const buyerEmail = subscription?.customer_email;
      if (buyerEmail) {
        User.findOneAndUpdate(
          { email: buyerEmail },
          { plan: 'none' },
          { new: true }
        ).then(user => {
          console.log(`Subscription canceled for ${buyerEmail}, plan set to none.`);
        }).catch(err => {
          console.error('Error updating user plan on cancellation:', err);
        });
      }
      console.log('Subscription canceled:', subscription);
    }
  }

  // Handle other events as needed...

  res.status(200).send('OK');
});

app.listen(3000, () => console.log('Server running on port 3000'));
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mathadventure'); // Use your actual connection string

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  plan: String
}));if (event.type === 'payment.created') {
  const payment = event.data.object.payment;
  const buyerEmail = payment?.buyer_email_address;
  const plan = payment?.note; // Or use a custom field to indicate plan

  if (buyerEmail && plan) {
    await User.findOneAndUpdate(
      { email: buyerEmail },
      { plan: plan },
      { new: true, upsert: true }
    );
    console.log(`Updated plan for ${buyerEmail} to ${plan}`);
  }
}