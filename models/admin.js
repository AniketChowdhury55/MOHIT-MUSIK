// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const adminSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// // Password hashing before saving the admin
// adminSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });

// // Method to check the password
// adminSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('Admin', adminSchema);

