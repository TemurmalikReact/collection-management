const { Router } = require("express");
const router = Router();

const { check, validationResult } = require("express-validator");

const Collection = require("../modules/Collection");

// api/collections
router.get("/", async (_, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/collections/:id
router.get("/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    res.json(collection);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(
  "/create",
  [
    check("name", "Enter a name of collection").isLength({ min: 1 }),
    check("description", "Add a description to your collection").isLength({ min: 1 }),
    check("theme", "Add a theme description to your Collection").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: errors.array()[0].msg,
        });
      }

      const {
        name,
        description,
        theme,
        owner_id,
        required_number,
        required_title,
        required_description,
        required_date,
        required_checkbox,
      } = req.body;

      const collection = new Collection({
        name,
        description,
        theme,
        owner_id,
        required_number,
        required_title,
        required_description,
        required_date,
        required_checkbox,
      });

      await collection.save();

      res.status(201).json({ message: "Collection created", data: collection });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.post(
  "/update",
  [
    check("name", "Enter a name of Collection").isLength({ min: 1 }),
    check("description", "Add a description to your Collection").isLength({ min: 1 }),
    check("theme", "Add a theme description to your Collection").isLength({ min: 1 }),
    check("owner_id", "Register to create Collections").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: errors.array()[0].msg,
        });
      }
      
      const {
        name,
        description,
        theme,
        id
      } = req.body;

      const collection = await Collection.findById(id);

      collection.name = name;
      collection.description = description;
      collection.theme = theme;

      await collection.save();

      res.status(201).json({ message: "Collection created", data: collection });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

// api/auth/users/delete
router.delete("/delete", async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.body.id);

    res.status(201).json({ message: "Collection has been deleted" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/users/update-status
// router.post("/update-status", async (req, res) => {
//   try {
//     const { id, isBlocked } = req.body;

//     const user = await Collection.findById(id);

//     Collection.isBlocked = isBlocked;

//     await Collection.save();

//     res.status(201).json(user);
//   } catch (e) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // api/users/update-status/all
// router.post("/update-status/all", async (req, res) => {
//   try {
//     const { isBlocked } = req.body;

//     await Collection.updateMany({ isBlocked: { $gte: !isBlocked } }, { isBlocked });

//     res.status(201).json({ message: "All users has been updated" });
//   } catch (e) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // api/users/delete
// router.delete("/delete", async (req, res) => {
//   try {
//     await Collection.findByIdAndDelete(req.body.id);

//     res.status(201).json({ message: "User has been deleted" });
//   } catch (e) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // api/users/delete/all
// router.delete("/delete/all", async (req, res) => {
//   try {
//     await Collection.deleteMany({});

//     res.status(201).json({ message: "All Users has been deleted" });
//   } catch (e) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

module.exports = router;
