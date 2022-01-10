import mongoose from "mongoose";

const CardScheema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
export const Card = mongoose.model("Card", CardScheema);
