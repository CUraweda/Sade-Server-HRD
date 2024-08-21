const path = require("path");
const canvas = require("canvas");
const faceapi = require("face-api.js");
const { fork } = require("child_process");
const faceDao = require("../../dao/faceDao");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(__dirname, "models");

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
};

const trainInitialFace = async (imageData) => {
  if (!imageData) {
    throw new Error("Data gambar tidak di temukan");
  }

  let buffer;
  if (typeof imageData === "string") {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    buffer = Buffer.from(base64Data, "base64");
  } else if (Buffer.isBuffer(imageData)) {
    buffer = imageData;
  } else {
    throw new Error("Format data gagal");
  }

  const img = await canvas.loadImage(buffer);
  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length !== 1) {
    throw new Error("Gambar harus berisi tepat satu wajah");
  }

  return detections[0].descriptor;
};

process.on("message", async (data) => {
  try {
    await loadModels();

    const { name, imageData } = data;

    if (!imageData || Object.keys(imageData).length === 0) {
      throw new Error("Data gambar tidak ditemukan");
    }

    const initialImageKey = Object.keys(imageData)[0];

    if (!imageData[initialImageKey]) {
      throw new Error("Data gambar awal tidak ada");
    }

    const initialDescriptor = await trainInitialFace(
      imageData[initialImageKey]
    );

    if (!initialDescriptor) {
      throw new Error("Failed to generate initial face descriptor");
    }

    if (initialDescriptor.length !== 128) {
      throw new Error(`Invalid descriptor length: ${initialDescriptor.length}`);
    }

    const remainingImages = Object.fromEntries(
      Object.entries(imageData).slice(1)
    );

    const successfulDescriptors = await trainRemainingFaces(
      name,
      remainingImages,
      initialDescriptor
    );

    successfulDescriptors.unshift(Array.from(initialDescriptor));

    await saveFaceDescriptors(name, successfulDescriptors);

    process.send({ status: "success" });
  } catch (error) {
    console.error("Error in parent worker:", error);
    process.send({ status: "failed", reason: error.message });
  } finally {
    process.exit(0);
  }
});

const trainRemainingFaces = async (name, imageData, initialDescriptor) => {
  if (!initialDescriptor) {
    throw new Error("Initial descriptor is undefined");
  }
  const workerPath = path.join(__dirname, "face_training_worker_child.js");
  const workers = [];

  for (const [key, value] of Object.entries(imageData)) {
    if (!value) {
      console.warn(`Image data for key ${key} is missing, skipping`);
      continue;
    }

    const worker = fork(workerPath);
    workers.push(
      new Promise((resolve, reject) => {
        worker.send({
          name,
          imageData: value,
          initialDescriptor: Array.isArray(initialDescriptor)
            ? initialDescriptor
            : Array.from(initialDescriptor),
        });

        worker.on("message", (message) => {
          if (message.status === "success") {
            resolve(message.descriptor);
          } else {
            reject(new Error(message.reason));
          }
        });
      })
    );
  }

  const results = await Promise.all(workers);
  return results;
};

const saveFaceDescriptors = async (name, descriptors) => {
  for (const descriptor of descriptors) {
    if (!descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
      throw new Error("Invalid descriptor: must be an array of 128 elements");
    }

    const faceData = {
      name: name,
      descriptor: descriptor,
    };

    await faceDao.saveFaceDescriptor(faceData);
  }
};
