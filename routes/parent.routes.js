const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parent.controller');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'thirdpartyImage', maxCount: 1 },
    { name: 'childImage_0', maxCount: 1 },
    { name: 'childImage_1', maxCount: 1 },
    { name: 'childImage_2', maxCount: 1 },
  ]),
  parentController.createParent
);

router.get('/', parentController.getAllParents);

module.exports = router;
