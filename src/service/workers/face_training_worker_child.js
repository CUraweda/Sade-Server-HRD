const canvas = require("canvas");
const faceapi = require("face-api.js");
const path = require("path");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(__dirname, "models");

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
};

const trainFace = async (imageData, initialDescriptor) => {
  if (!imageData) {
    throw new Error("Data gambar tidak ditemukan");
  }

  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const img = await canvas.loadImage(buffer);
  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length !== 1) {
    throw new Error(
      "Dalam gambar harus berisi 1 wajah tidak boleh kosong atau pun lebih"
    );
  }

  const detection = detections[0];

  if (
    faceapi.euclideanDistance(initialDescriptor, detection.descriptor) > 0.6
  ) {
    throw new Error("Data muka tidak cocok dengan muka awal");
  }

  return detection.descriptor;
};

process.on("message", async (data) => {
  try {
    await loadModels();

    const { imageData, initialDescriptor } = data;
    if (!imageData || !initialDescriptor) {
      throw new Error("Data wajah di awal pemotretan tidak ada");
    }
    const descriptor = await trainFace(
      imageData,
      new Float32Array(initialDescriptor)
    );
    process.send({ status: "success", descriptor: Array.from(descriptor) });
  } catch (error) {
    process.send({ status: "failed", reason: error.message });
  } finally {
    process.exit(0);
  }
});
