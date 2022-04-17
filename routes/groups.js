const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// Group Model
const Group = require("../models/Group");

//INDEX - Show all Groups
router.get("/", (req, res) => {
  // Get all groups from DB
  Group.find({}, (err, allGroups) => {
    if (err) {
      console.log(err);
    } else {
      res.render("groups/index", {
        groups: allGroups,
      });
    }
  });
});

//NEW - Show form to create new group
router.get("/new", ensureAuthenticated, (req, res) => {
  res.render("groups/new");
});

// CREATE - Create new group
router.post("/", ensureAuthenticated, (req, res) => {
  // get data from form and add to groups array
  const { groupName, description, course, groupType, inviteUrl } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };

  const newGroup = new Group({
    groupName,
    description,
    course,
    groupType,
    inviteUrl,
    author,
  });

  //  Create a new group and save to DB
  Group.create(newGroup, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success_msg", "Group Created");
      // redirect back to group page
      res.redirect("/groups");
    }
  });
});

module.exports = router;
