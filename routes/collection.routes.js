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
    check("addition_number.*", "Name a number input you want to include").isLength({ min: 1 }),
    check("addition_title.*", "Name a title input you want to include").isLength({ min: 1 }),
    check("addition_description.*", "Name a description input you want to include").isLength({ min: 1 }),
    check("addition_date.*", "Name a date input you want to include").isLength({ min: 1 }),
    check("addition_checkbox.*", "Name a checkbox input you want to include").isLength({ min: 1 }),
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
        addition_number,
        addition_title,
        addition_description,
        addition_date,
        addition_checkbox,
      } = req.body;

      const collection = new Collection({
        name,
        description,
        theme,
        owner_id,
        addition_number,
        addition_title,
        addition_description,
        addition_date,
        addition_checkbox,
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
        _id
      } = req.body;

      const collection = await Collection.findById(_id);

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

module.exports = router;
