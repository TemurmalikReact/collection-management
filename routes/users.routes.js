const { Router } = require("express");
const router = Router();

const User = require("../modules/User");

// api/auth/users
router.get("/", async (_, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/auth/users/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/auth/users/update-status
router.post("/update-status", async (req, res) => {
  try {
    const { id, isBlocked } = req.body;

    const user = await User.findById(id);

    user.isBlocked = isBlocked;

    await user.save();

    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/auth/users/update-admin
router.post("/update-admin", async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findById(id);

    if (user.role.includes('ADMIN')) {
      user.role = ['USER'];
    } else {
      user.role = ['USER', 'ADMIN'];
    }

    await user.save();

    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/auth/users/update-status/all
router.post("/update-status/all", async (req, res) => {
  try {
    const { isBlocked } = req.body;

    await User.updateMany({ isBlocked: { $gte: !isBlocked } }, { isBlocked });

    res.status(201).json({ message: "All users has been updated" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/auth/users/delete
router.delete("/delete", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);

    res.status(201).json({ message: "User has been deleted" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/auth/users/delete/all
router.delete("/delete/all", async (req, res) => {
  try {
    await User.deleteMany({});

    res.status(201).json({ message: "All Users has been deleted" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
