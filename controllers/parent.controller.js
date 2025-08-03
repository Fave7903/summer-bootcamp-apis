const Parent = require('../models/parent.model');
const Child = require('../models/child.model');
const uploadToImgBB = require('../utils/uploadToImgBB');

exports.createParent = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      thirdpartyName,
      thirdpartyPhoneNumber,
    } = req.body;

    const children = JSON.parse(req.body.children || '[]');

    const parentImageBuffer = req.files?.['image']?.[0]?.buffer;
    const thirdpartyImageBuffer = req.files?.['thirdpartyImage']?.[0]?.buffer;

    const parentImageUrl = parentImageBuffer ? await uploadToImgBB(parentImageBuffer) : null;
    const thirdpartyImageUrl = thirdpartyImageBuffer ? await uploadToImgBB(thirdpartyImageBuffer) : null;

    const childDocs = [];

    for (const child of children) {
      const childImageFile = req.files[`childImage_${child.tempId}`]?.[0];
      const imageUrl = childImageFile ? await uploadToImgBB(childImageFile.buffer) : null;

      const newChild = await Child.create({
        name: child.name,
        class: child.class,
        image: imageUrl,
        schoolAttended: child.schoolAttended,
        bootcampCourse: child.bootcampCourse,
        age: child.age,
      });

      childDocs.push(newChild._id);
    }

    const newParent = await Parent.create({
      name,
      phoneNumber,
      image: parentImageUrl,
      thirdpartyName,
      thirdpartyPhoneNumber,
      thirdpartyImage: thirdpartyImageUrl,
      children: childDocs,
    });

    res.status(201).json({ parent: newParent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllParents = async (req, res) => {
  const parents = await Parent.find().populate('children');
  res.json({ parents });
};
