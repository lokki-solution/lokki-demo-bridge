require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QR = require("qrcode");
const cors = require("cors");

const app = express();

app.use(express.json());

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));

app.post("/qr/generate", async (req, res) => {
  try {
    console.log(req.body);
    const { userId } = req.body;

    // Validate user input
    if (!userId) {
      res.status(400).send("User Id is required");
    }

    // Generate encrypted data
    const encryptedData = jwt.sign(
      { userId: userId },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1d",
      }
    );

    // Generate qr code
    const dataImage = await QR.toDataURL(encryptedData);

    // Return qr code
    return res.status(200).json({ dataImage, encryptedData });
  } catch (err) {
    console.log(err);
  }
});

app.post("/qr/scan", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).send("Token is required");
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const authToken = jwt.sign({ user_id: decoded.userId }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    // Return token
    return res.status(200).json({ token: authToken, userId: decoded.userId });
  } catch (err) {
    console.log(err);
  }
});
module.exports = app;
