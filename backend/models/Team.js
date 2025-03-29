const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamId: { type: Number, unique: true }, // Auto-incrementing team ID
  name: { type: String, required: true },
  description: { type: String },
  leaderEmail: { type: String, required: true }, // Using email instead of leaderId
  members: [
    {
      email: { type: String, required: true }, // Use email instead of userId
      permissions: { type: [String], default: ["read"] }, // Read, write, delete, etc.
    },
  ],
  joinRequests: [
    {
      email: { type: String, required: true }, // Email of the user requesting to join
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // Request status
      requestedAt: { type: Date, default: Date.now }, // Timestamp for join request
    },
  ],
});

// Auto-incrementing `teamId`
teamSchema.pre("save", async function (next) {
  if (!this.teamId) {
    const lastTeam = await mongoose.model("Team").findOne({}, {}, { sort: { teamId: -1 } });
    this.teamId = lastTeam ? lastTeam.teamId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Team", teamSchema);