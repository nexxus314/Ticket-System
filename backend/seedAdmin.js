const bcrypt = require("bcrypt");
const users = require("./models/User");

async function seedAdmin() {
  // Check if admin already exists
  const adminExists = users.find(u => u.role === "admin");
  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = {
    id: users.length + 1,
    email: "admin@test.com",
    password: hashedPassword,
    role: "admin"
  };

  users.push(adminUser);

  console.log("Admin user created:", adminUser.email);
}

seedAdmin();