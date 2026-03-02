import { Router } from "express";
import { identifyContact } from "../services/contactServices";

const router = Router();

router.post("/", async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber required" });
  }

  const result = await identifyContact(email, phoneNumber);
  res.status(200).json(result);
});

export default router;