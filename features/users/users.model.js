import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  userName: String,
  fullName: String,
  description: String,
  email: String,
  password: String,
  birthDate: Date,
}, {
  timestamps: true,
  // Oculta la contraseña en las respuestas JSON
  toJSON: {
    transform: (_doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
});

// Hashea la contraseña al crear un usuario o si se ha modificado
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// Hashea la contraseña cuando se actualiza con findByIdAndUpdate
userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  const password = update.password ?? update.$set?.password;
  if (!password) return;
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  if (update.$set?.password) update.$set.password = hash;
  else update.password = hash;
});

const User = mongoose.model("User", userSchema);

export default User;
