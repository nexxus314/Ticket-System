require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const authRoutes = require("./routes/auth")
const ticketRoutes = require("./routes/tickets")
const users = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json())
app.use("/auth",authRoutes);
app.use("/tickets",ticketRoutes);

const PORT = process.env.PORT || 5000;

app.get("/health",(req,res)=>{
    res.json({status:"ok"})
})
async function seedAdminIfNeeded() {
  const exists = users.find(u => u.role === "admin");
  if (exists) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  users.push({
    id: users.length + 1,
    email: "admin@test.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin seeded on server start");
}

seedAdminIfNeeded();

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)

});