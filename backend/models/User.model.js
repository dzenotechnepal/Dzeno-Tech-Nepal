import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "ceo", "developer", "employee", "intern"],
      default: "employee",
    },
    designation: { type: String },
    department: { type: String },
    employeeId: { type: String, unique: true },
    panNumber: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number, min: 0 },
    citizenshipNumber: { type: String },
    phone: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true },
    bankName: { type: String },
    bankAccountHolderName: { type: String },
    bankAccountNumber: { type: String },
    bankBranch: { type: String },
    ssfEnrolled: { type: Boolean, default: true },
    avatar: { type: String },
    avatarPublicId: { type: String },
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.isNew && (!this.employeeId || this.employeeId === "")) {
    const lastUser = await mongoose.model("User").findOne({}, {}, { sort: { createdAt: -1 } });
    let nextIdNum = 1;
    if (lastUser && lastUser.employeeId && lastUser.employeeId.startsWith("EMP-")) {
      const parts = lastUser.employeeId.split("-");
      const lastNum = parseInt(parts[1], 10);
      if (!isNaN(lastNum)) {
        nextIdNum = lastNum + 1;
      }
    }
    this.employeeId = `EMP-${nextIdNum.toString().padStart(3, "0")}`;
  }
});

userSchema.index({ isActive: 1, createdAt: -1 });
userSchema.index({ name: 1 });

export const User = mongoose.model("User", userSchema);
