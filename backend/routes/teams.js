const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const User = require("../models/User");

router.post("/create", async (req, res) => {
    try {
      const { name, description, leaderEmail } = req.body;
  
      if (!name || !leaderEmail) {
        return res.status(400).json({ message: "Team name and leader email are required" });
      }
  
      const team = new Team({
        name,
        description,
        leaderEmail,
        members: [{ email: leaderEmail, permissions: ["admin"] }],
      });
  
      await team.save();
      res.status(201).json({ message: "Team created successfully", team });
    } catch (error) {
      res.status(500).json({ message: "Error creating team", error });
    }
  });

router.post("/:teamId/join-request", async (req, res) => {
    try {
      const { teamId } = req.params;
      const userEmail = req.body; 

      const team = await Team.findOne({ teamId });
      if (!team) return res.status(404).json({ message: "Team not found" });
  
      if (team.joinRequests.includes(userEmail)) {
        return res.status(400).json({ message: "Join request already sent" });
      }
  
      team.joinRequests.push(userEmail);
      await team.save();
      res.status(200).json({ message: "Join request sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error sending join request", error });
    }
  });

router.post("/:teamId/add-member", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { email, permissions } = req.body;

    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.members.some((member) => member.email === email)) return res.status(400).json({ message: "Member already exists" });

    team.members.push({ email, permissions });
    await team.save();
    res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error });
  }
});

router.delete("/:teamId/remove-member/:email", async (req, res) => {
  try {
    const { teamId, email } = req.params;
    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter((member) => member.email !== email);
    await team.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing member", error });
  }
});


// Delete Team
router.delete("/:teamId/delete", async (req, res) => {
  try {
    const { teamId } = req.params;
    await Team.findOneAndDelete({ teamId });
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team", error });
  }
});

router.get("/user/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const teams = await Team.find({ "members.email": email });
  
      if (!teams.length) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ message: "Error fetching teams", error });
    }
  });

  router.get("/:teamId/details", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      if (isNaN(teamId)) return res.status(400).json({ message: "Invalid team ID" });
  
      const team = await Team.findOne({ teamId }).select("-members");
      if (!team) return res.status(404).json({ message: "Team not found" });
  
      res.status(200).json(team);
    } catch (error) {
      console.error("Error fetching team details:", error);
      res.status(500).json({ message: "Error fetching team details", error: error.message });
    }
  });
  
  router.get("/:teamId/members", async (req, res) => {
    try {
      const { teamId } = req.params;
      const team = await Team.findOne({ teamId });
      if (!team) return res.status(404).json({ message: "Team not found" });
  
      const memberEmails = team.members.map(member => member.email);
      const members = await User.find({ email: { $in: memberEmails } }, "email name");
  
      const enrichedMembers = team.members.map(member => ({
        email: member.email,
        name: members.find(m => m.email === member.email)?.name || "Unknown",
        permissions: member.permissions
      }));
  
      res.status(200).json(enrichedMembers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching members", error });
    }
  });
  
  router.put("/:teamId/members/:email/permissions", async (req, res) => {
    try {
      const { teamId, email } = req.params;
      const { permissions } = req.body;
  
      if (!Array.isArray(permissions)) {
        return res.status(400).json({ message: "Permissions must be an array" });
      }
  
      const team = await Team.findOne({ teamId });
      if (!team) return res.status(404).json({ message: "Team not found" });
  
      const member = team.members.find((m) => m.email === email);
      if (!member) return res.status(404).json({ message: "Member not found" });
  
      member.permissions = permissions;
      await team.save();
  
      res.status(200).json({ message: "Permissions updated successfully", members: team.members });
    } catch (error) {
      console.error("Error updating permissions:", error);
      res.status(500).json({ message: "Error updating permissions", error: error.message });
    }
  });
  
  router.post("/:teamId/join-request/:email/respond", async (req, res) => {
    try {
      const { teamId, email } = req.params;
      const { action } = req.body; 
  
      const team = await Team.findOne({ teamId });
      if (!team) return res.status(404).json({ message: "Team not found" });
  
      const requestIndex = team.joinRequests.findIndex((r) => r.email === email);
      if (requestIndex === -1) {
        return res.status(404).json({ message: "Join request not found" });
      }
  
      if (action === "accept") {
        team.members.push({ email, permissions: ["read"] });
      }
  
      team.joinRequests.splice(requestIndex, 1);
      await team.save();
  
      res.status(200).json({ message: `Join request ${action}ed successfully` });
    } catch (error) {
      res.status(500).json({ message: "Error processing join request", error });
    }
  });

module.exports = router;
