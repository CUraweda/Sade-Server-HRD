const { KnownFaces } = require("../models");

const saveFaceDescriptor = async (faceData) => {
  if (!faceData.descriptor || !Array.isArray(faceData.descriptor)) {
    throw new Error("Descriptor is required and must be an array");
  }
  if (faceData.descriptor.length !== 128) {
    throw new Error(`Invalid descriptor length: ${faceData.descriptor.length}`);
  }

  const newFace = await KnownFaces.create({
    name: faceData.name,
    descriptor: faceData.descriptor,
  });
  return newFace;
};

const checkFace = async (teacher) => {
  if (!teacher) {
    throw new Error("Teacher name is required");
  }

  const face = await KnownFaces.findOne({
    where: {
      name: teacher,
    },
  });

  return face;
};

module.exports = { saveFaceDescriptor, checkFace };
