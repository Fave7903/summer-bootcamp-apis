const Parent = require('../models/parent.model');
const Child = require('../models/child.model');
const uploadToImgBB = require('../utils/uploadToImgBB');

exports.createParent = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      phoneNumber,
      thirdpartyName,
      thirdpartyPhoneNumber,
      thirdpartyRel,
    } = req.body;

    const children = JSON.parse(req.body.children || '[]');

    const parentImageBuffer = req.files?.['image']?.[0]?.buffer;
    const imageOfDadBuffer = req.files?.['imageOfDad']?.[0]?.buffer;
    const thirdpartyImageBuffer = req.files?.['thirdpartyImage']?.[0]?.buffer;

    const parentImageUrl = parentImageBuffer ? await uploadToImgBB(parentImageBuffer) : null;
    const imageOfDadUrl = imageOfDadBuffer ? await uploadToImgBB(imageOfDadBuffer) : null;
    const thirdpartyImageUrl = thirdpartyImageBuffer ? await uploadToImgBB(thirdpartyImageBuffer) : null;

    const childDocs = [];

    const childImageFiles = req.files?.['childImages'] || [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childImageFile = childImageFiles[i]; // match by index
      const imageUrl = childImageFile ? await uploadToImgBB(childImageFile.buffer) : null;

      const newChild = await Child.create({
        name: child.name,
        class: child.class,
        image: imageUrl,
        schoolAttended: child.schoolAttended,
        bootcampCourse: child.bootcampCourse,
        age: child.age,
        gender: child.gender,
        allergies: child.allergies, 
      });

      childDocs.push(newChild._id);
    }


    const newParent = await Parent.create({
      name,
      email,
      address,
      phoneNumber,
      image: parentImageUrl,
      imageOfDad: imageOfDadUrl,
      thirdpartyName,
      thirdpartyPhoneNumber,
      thirdpartyRel,
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


exports.getParent = async (req, res) => {
  const parent = await Parent.findById(req.params.id).populate('children');
  if (!parent) {
    return res.status(404).json({ message: 'Parent not found' });
  }
  res.json({ parent });
};


exports.updateParent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing parent
    const parent = await Parent.findById(id).populate('children');
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Parse children if provided
    const children = req.body.children ? JSON.parse(req.body.children) : [];

    // Update parent text fields if provided
    if (req.body.name) parent.name = req.body.name;
    if (req.body.email) parent.email = req.body.email;
    if (req.body.address) parent.address = req.body.address;
    if (req.body.phoneNumber) parent.phoneNumber = req.body.phoneNumber;
    if (req.body.thirdpartyName) parent.thirdpartyName = req.body.thirdpartyName;
    if (req.body.thirdpartyPhoneNumber) parent.thirdpartyPhoneNumber = req.body.thirdpartyPhoneNumber;
    if (req.body.thirdpartyRel) parent.thirdpartyRel = req.body.thirdpartyRel;

    // Handle image uploads if provided
    if (req.files?.['image']?.[0]?.buffer) {
      parent.image = await uploadToImgBB(req.files['image'][0].buffer);
    }
    if (req.files?.['imageOfDad']?.[0]?.buffer) {
      parent.imageOfDad = await uploadToImgBB(req.files['imageOfDad'][0].buffer);
    }
    if (req.files?.['thirdpartyImage']?.[0]?.buffer) {
      parent.thirdpartyImage = await uploadToImgBB(req.files['thirdpartyImage'][0].buffer);
    }

    // Handle children updates
    const childImageFiles = req.files?.['childImages'] || [];

    for (let i = 0; i < children.length; i++) {
      const childData = children[i];
      const childImageFile = childImageFiles[i];
      let imageUrl = null;

      if (childImageFile) {
        imageUrl = await uploadToImgBB(childImageFile.buffer);
      }

      if (childData._id) {
        // Update existing child
        const existingChild = await Child.findById(childData._id);
        if (existingChild) {
          if (childData.name) existingChild.name = childData.name;
          if (childData.class) existingChild.class = childData.class;
          if (childData.schoolAttended) existingChild.schoolAttended = childData.schoolAttended;
          if (childData.bootcampCourse) existingChild.bootcampCourse = childData.bootcampCourse;
          if (childData.age) existingChild.age = childData.age;
          if (childData.gender) existingChild.gender = childData.gender;
          if (childData.allergies) existingChild.allergies = childData.allergies;
          if (imageUrl) existingChild.image = imageUrl;

          await existingChild.save();
        }
      } else {
        // Create new child
        const newChild = await Child.create({
          name: childData.name,
          class: childData.class,
          image: imageUrl,
          schoolAttended: childData.schoolAttended,
          bootcampCourse: childData.bootcampCourse,
          age: childData.age,
          gender: childData.gender,
          allergies: childData.allergies,
        });
        parent.children.push(newChild._id);
      }
    }

    // Save updated parent
    await parent.save();

    res.json({ message: 'Parent updated successfully', parent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
