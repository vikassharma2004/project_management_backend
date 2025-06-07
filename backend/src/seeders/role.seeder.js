import mongoose from "mongoose";
import { connectDB } from "../config/database.config.js";
import { Role } from "../models/roles-permission.js";
import { ROLES } from "../enums/role.enum.js";
import { rolepermission } from "../utils/role-permission.js";
import { config } from "../config/app.config.js";
console.log(config);

const seedRoles = async () => {
  console.log("🌱 Seeding roles started...");
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("deleting all roles");
    console.log("deleting all roles");

    await Role.deleteMany({}, { session });
    console.log("✅ All roles deleted.");

    for (const roleName of Object.values(ROLES)) {
      const exists = await Role.findOne({ name: roleName }).session(session);

      if (exists) {
        console.log(`⚠️ Role '${roleName}' already exists. Skipping...`);
        continue;
      }

      const newRole = new Role({
        name: roleName,
        permissions: rolepermission[roleName],
      });

      await newRole.save({ session });
      console.log(`✅ Role '${roleName}' created.`);
    }

    await session.commitTransaction();
    await session.endSession();
    console.log("✅ Role seeding completed.");
  } catch (error) {
    await session.abortTransaction();
    console.error("❌ Error seeding roles:", error.message);
  } finally {
    session.endSession();
  }
};

seedRoles();
