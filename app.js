const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const path = require('path');


app.use(cors());
app.use(express.json());

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Default route (open UI)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 🔑 Admin Key (you can change this)
const ADMIN_KEY = "12345";

// 📦 In-memory complaints storage
let complaints = [];
let idCounter = 1;


// 🟢 Get all complaints
app.get("/complaints", (req, res) => {
  res.json(complaints);
});

// 🟡 Add complaint (User)
app.post("/complaint", (req, res) => {
  const { name, issue } = req.body;

  if (!name || !issue) {
    return res.status(400).json({ message: "Name and issue are required" });
  }

  const newComplaint = {
    id: idCounter++,
    name,
    issue,
    status: "Pending"
  };

  complaints.push(newComplaint);

  res.json({ message: "Complaint added successfully", complaint: newComplaint });
});

// 🔐 Middleware to check admin
function checkAdmin(req, res, next) {
  const key = req.headers["admin-key"];

  if (key !== ADMIN_KEY) {
    return res.status(403).json({ message: "Unauthorized (Admin only)" });
  }

  next();
}

// 🔵 Resolve complaint (Admin only)
app.put("/resolve/:id", checkAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  complaint.status = "Resolved";

  res.json({ message: "Complaint resolved", complaint });
});

// 🔴 Delete complaint (Admin only)
app.delete("/delete/:id", checkAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  const index = complaints.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  complaints.splice(index, 1);

  res.json({ message: "Complaint deleted" });
});

// 🚀 Start server
const PORT = 5000;


// ✅ Start server ONLY if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

module.exports = app;
