const express = require("express");
const shortid = require("shortid");
const Url = require("../models/Url");

const router = express.Router();


router.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  try {
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json(url);
    }

    const shortId = shortid.generate();

    url = new Url({
      originalUrl,
      shortId
    });

    await url.save();

    res.json(url);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.get("/:shortId", async (req, res) => {
  try {
    const url = await Url.findOne({
      shortId: req.params.shortId
    });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (err) {
    res.status(500).send("Error");
  }
});

module.exports = router;