import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    name: String,
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", RoomSchema);
