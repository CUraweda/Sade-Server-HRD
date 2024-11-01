const path = require("path");
const { fork } = require("child_process");
const faceapi = require("face-api.js");
const { KnownFaces } = require("../models");
const faceDao = require("../dao/faceDao");

let knownFaces = [];

async function loadModels() {
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(
      "./src/service/workers/models"
    );
    await faceapi.nets.faceLandmark68Net.loadFromDisk(
      "./src/service/workers/models"
    );
    await faceapi.nets.faceRecognitionNet.loadFromDisk(
      "./src/service/workers/models"
    );
    await loadKnownFaces();
  } catch (error) {
    console.error("Error loading models:", error.message);
  }
}

async function loadKnownFaces() {
  console.log("Starting to load known faces...");
  try {
    knownFaces = await KnownFaces.findAll();
    console.log(`Loaded ${knownFaces.length} known faces from database`);

    knownFaces = knownFaces.map((face) => {
      return {
        ...face.toJSON(),
        descriptor: JSON.parse(face.descriptor),
      };
    });
  } catch (error) {
    console.error("Error loading known faces from database:", error.message);
  }
}

async function resetProgram() {
console.log("Resetting program...");
  await loadModels();
  console.log("Program reset complete. Models and known faces reloaded.");
}

loadModels();

const trainFace = async (teacher, images) => {
  return new Promise((resolve, reject) => {
    if (!teacher || !images) {
      return reject({ status: 400, message: "Invalid input data" });
    }

    const name = teacher;
    const imageData = images;

    if (Object.keys(imageData).length === 0) {
      return reject({ status: 400, message: "No image data provided" });
    }

    const workerPath = path.join(
      __dirname,
      "./workers/face_training_worker_parent.js"
    );
    const worker = fork(workerPath);

    console.time("Face training duration");

    worker.send({ name, imageData });

    worker.on("message", async (message) => {
      if (message.status === "success") {
        console.timeEnd("Face training duration");
        console.log("Face training job completed");
        await resetProgram();
        resolve({
          successCount: message.successCount,
          teacher: name,
          failCount: message.failCount,
        });
      } else {
        console.log("Face training job failed");
        reject({
          status: 400,
          message: "Face training failed",
          teacher: name,
          reason: message.reason,
        });
      }
    });
  });
};

const checkFace = async (teacher) => {
  return faceDao.checkFace(teacher);
};

const detectFace = async (descriptor, teacher) => {
  if (!descriptor || !Array.isArray(descriptor)) {
    throw new Error("Invalid face data array");
  }

  const results = [];

  const facesToCheck = knownFaces.filter((face) => face.name === teacher);

  if (facesToCheck.length === 0) {
    return results;
  }

  for (const faceData of descriptor) {
    if (!Array.isArray(faceData) || faceData.length !== 128) {
      results.push({ error: "Invalid face data" });
      continue;
    }

    const queryDescriptor = new Float32Array(faceData);

    let bestMatch = { teacher: null, distance: Infinity };
    for (const face of facesToCheck) {
      if (
        !face.descriptor ||
        !Array.isArray(face.descriptor) ||
        face.descriptor.length !== 128
      ) {
        console.error("Invalid known face data:");
        continue;
      }

      const faceDescriptor = new Float32Array(face.descriptor);

      if (faceDescriptor.length !== queryDescriptor.length) {
        console.error(
          `Length mismatch for ${face.name}: faceDescriptor (${faceDescriptor.length}) != queryDescriptor (${queryDescriptor.length})`
        );
        continue;
      }

      try {
        const distance = faceapi.euclideanDistance(
          faceDescriptor,
          queryDescriptor
        );
        if (distance < bestMatch.distance) {
          bestMatch = { teacher: face.name, distance };
        }
      } catch (error) {
        console.error(`Error calculating distance for ${face.name}:`, error);
      }
    }

    results.push(bestMatch);
  }

  return results;
};

module.exports = {
  trainFace,
  checkFace,
  detectFace,
};
