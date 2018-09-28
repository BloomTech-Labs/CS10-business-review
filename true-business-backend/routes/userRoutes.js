const router = require("express").Router();
const { restricted } = require("../services/passport");
const Subscriber = require("../models/subscriber");

// Get a Subscriber's profile data
router.get("/info/:id", restricted, (req, res) => {
  const id = req.params.id;
  Subscriber.findById(id)
    .then(subscriber => {
      res.status(200).json(subscriber);
    })
    .catch(err => {
      res.send(500).json({ error: err.message });
    });
});

// Edit a Subscriber's profile data
router.put("/info/:id", restricted, async (req, res) => {
  const id = req.params.id;
  const settingsInfo = { ...req.body };

  await Subscriber.findById(id)
    .then(async subscriber => {
      const match = await subscriber.validPassword(settingsInfo.oldPassword);
      if (match) {
        settingsInfo.local.password = await subscriber.newPassword(
          settingsInfo.newPassword
        );
      }

      Subscriber.findByIdAndUpdate(id, settingsInfo)
        .then(subscriber => {
          res.status(201).json(subscriber);
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    })
    .catch(err => err);
});

// Mark a subscriber as subscribed
router.post("/subscribe/:id", restricted, (req, res) => {
  const id = req.params.id;
  Subscriber.findByIdAndUpdate(id, {
    paid: true,
    stripe_sub: req.body.stripe_sub,
    stripe_cust: req.body.stripe_cust
  })
    .then(res.status(201).json("Subscribed!"))
    .catch(err => {
      res.send(500).json({ error: err.message });
    });
});

// Mark a subscriber as unsubscribed
router.post("/unsubscribe/:id", restricted, (req, res) => {
  const id = req.params.id;
  Subscriber.findByIdAndUpdate(id, { paid: false })
    .then(res.status(201).json("Unsubscribed!"))
    .catch(err => {
      res.send(500).json({ error: err.message });
    });
});

module.exports = router;
