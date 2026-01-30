const User = require("./user.model");

// ===============================
// Admin assigns BUYER role to a user
// ===============================
exports.assignBuyerRole = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update role
    user.role = "BUYER";
    await user.save();

    return res.json({
      message: "User promoted to BUYER",
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    console.error("Error in assignBuyerRole:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// ===============================
// Get all users (Admin only)
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    return res.json(users);
  } catch (err) {
    console.error("Error in getAllUsers:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// ===============================
// Get single user by ID (Admin/Owner)
// ===============================
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("Error in getUserById:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// ===============================
// Optional: Delete user (Admin)
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error in deleteUser:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
