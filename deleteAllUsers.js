const mongoose = require('mongoose');
const Admin = require('./models/admin'); // Replace 'admin' with your user model if needed

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/admin-page', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.log('MongoDB Connection Error:', err);
});

// Delete all users
const deleteAllUsers = async () => {
  try {
    const result = await Admin.deleteMany({}); // Deletes all documents in the Admin collection
    console.log(`${result.deletedCount} users deleted.`);
  } catch (err) {
    console.error('Error deleting users:', err);
  } finally {
    mongoose.connection.close(); // Close the connection after operation
  }
};

// Run the script
deleteAllUsers();
