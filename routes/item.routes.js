const { Router } = require("express");
const router = Router();

const { check, validationResult } = require("express-validator");

const Item = require("../modules/Item");

// api/items
router.get("/", async (_, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/items/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(
  "/create",
  [
    check("name", "Enter a name of item").isLength({ min: 1 }),
    check("tags", "Add at least one tag to your Item").isLength({ min: 1 }),
    check("required_number.*.value", "Fill the required number input").isLength(
      { min: 1 }
    ),
    check("required_title.*.value", "Fill the required title input").isLength({
      min: 1,
    }),
    check(
      "required_description.*.value",
      "Fill the required description input"
    ).isLength({ min: 1 }),
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
        tags,
        owner_id,
        parent_id,
        required_number,
        required_title,
        required_description,
        required_date,
        required_checkbox,
        comments,
        likes,
      } = req.body;

      const item = new Item({
        name,
        tags,
        owner_id,
        parent_id,
        required_number,
        required_title,
        required_description,
        required_date,
        required_checkbox,
        comments,
        likes,
      });

      await item.save();

      res.status(201).json({ message: "item created", data: item });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.post(
  "/update",
  [
    check("name", "Enter a name of item").isLength({ min: 1 }),
    check("tags", "Add at least one tag to your Item").isLength({ min: 1 }),
    check("required_number.*.value", "Fill the required number input").isLength(
      { min: 1 }
    ),
    check("required_title.*.value", "Fill the required title input").isLength({
      min: 1,
    }),
    check(
      "required_description.*.value",
      "Fill the required description input"
    ).isLength({ min: 1 }),
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
        tags,
        required_number,
        required_title,
        required_description,
        required_date,
        required_checkbox,
        _id,
      } = req.body;

      const item = await Item.findById(_id);

      item.name = name;
      item.tags = tags;
      item.required_number = required_number;
      item.required_title = required_title;
      item.required_description = required_description;
      item.required_description = required_description;
      item.required_date = required_date;
      item.required_checkbox = required_checkbox;
      
      await item.save();

      res.status(201).json({ message: "item created", data: item });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

// api/auth/users/delete
router.delete("/delete", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.body.id);

    res.status(201).json({ message: "item has been deleted" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// api/auth/users/delete-all
router.delete("/delete-all", async (req, res) => {
  try {
    const { id } = req.body;

    await Item.deleteMany({ parent_id: { $gte: id } });

    res
      .status(201)
      .json({ message: "all item in this collection have been deleted" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
