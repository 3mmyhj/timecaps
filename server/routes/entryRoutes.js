const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Entry = require('../models/Entry'); // Adjusted path
const User = require('../models/User'); // Adjusted path

// @route   POST api/entries
// @desc    Create a new memory entry
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, imageUrl, unlockDate } = req.body; // Ensure 'description' matches model
  const userId = req.user.id;

  try {
    const newEntry = new Entry({
      userId,
      title,
      description, // Make sure this matches the schema (it does now)
      imageUrl,
      unlockDate: new Date(unlockDate), // Ensure unlockDate is a Date object
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error while creating entry');
  }
});

// @route   GET api/entries
// @desc    Get all entries for the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    // Filter out entries whose unlockDate has not passed
    const now = new Date();
    const accessibleEntries = entries.map(entry => {
      if (entry.unlockDate > now) {
        // If unlockDate is in the future, don't send full content
        return {
          _id: entry._id,
          title: entry.title,
          unlockDate: entry.unlockDate,
          createdAt: entry.createdAt,
          isLocked: true,
          // Optionally, include a hint or just indicate it's locked
          // imageHint: entry.imageHint, // if you re-add imageHint
        };
      }
      return { ...entry.toObject(), isLocked: false }; // Send full entry if unlocked
    });
    res.json(accessibleEntries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error while fetching entries');
  }
});

// @route   GET api/entries/:id
// @desc    Get a specific entry by ID (if unlocked)
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.user.id });

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    const now = new Date();
    if (entry.unlockDate > now) {
      return res.status(403).json({
        msg: 'This memory is not unlocked yet.',
        title: entry.title,
        unlockDate: entry.unlockDate,
        isLocked: true
      });
    }

    res.json({ ...entry.toObject(), isLocked: false });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Entry not found (invalid ID format)' });
    }
    res.status(500).send('Server error while fetching single entry');
  }
});

// @route   PUT api/entries/:id
// @desc    Update an entry (Not typically allowed for time capsules, but including for completeness if needed)
// @access  Private
// router.put('/:id', authMiddleware, async (req, res) => {
//   const { title, description, imageUrl, unlockDate } = req.body;
//   try {
//     let entry = await Entry.findOne({ _id: req.params.id, userId: req.user.id });
//     if (!entry) return res.status(404).json({ msg: 'Entry not found' });

//     // For a time capsule, you might restrict updates, especially after creation or if too close to unlockDate.
//     // For now, allowing update:
//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (description) updatedFields.description = description;
//     if (imageUrl) updatedFields.imageUrl = imageUrl;
//     if (unlockDate) updatedFields.unlockDate = new Date(unlockDate);

//     entry = await Entry.findByIdAndUpdate(
//       req.params.id,
//       { $set: updatedFields },
//       { new: true }
//     );
//     res.json(entry);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// @route   DELETE api/entries/:id
// @desc    Delete an entry
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.user.id });

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found or not authorized' });
    }

    await Entry.deleteOne({ _id: req.params.id }); // Replaced remove() which is deprecated

    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Entry not found (invalid ID format)' });
    }
    res.status(500).send('Server error while deleting entry');
  }
});


module.exports = router;
