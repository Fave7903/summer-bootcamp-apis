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
    { name: 'imageOfDad', maxCount: 1 },
    { name: 'thirdpartyImage', maxCount: 1 },
    { name: 'childImages', maxCount: 20 }, 
  ]),
  parentController.createParent
);

router.get('/', parentController.getAllParents);

router.get('/:id', parentController.getParent);

module.exports = router;
