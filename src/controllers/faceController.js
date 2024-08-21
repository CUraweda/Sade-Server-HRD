const faceService = require("../service/faceService");

const trainFace = async (req, res) => {
  try {
    const { teacher, images } = req.body;

    const result = await faceService.trainFace(teacher, images);

    res.status(202).json({
      message: "Face training completed",
      successCount: result.successCount,
      failCount: result.failCount,
    });
  } catch (error) {
    console.error("Error in trainFace:", error);
    res
      .status(error.status || 500)
      .json({ error });
  }
};

const checkFace = async (req, res) => {
  try {
    const { teacher } = req.body;

    const result = await faceService.checkFace(teacher);

    if (!result) {
      return res.status(404).json({ message: "Face not registered" });
    }

    res.status(200).json({ message: result });
  } catch (error) {
    console.error("Error in checkFace", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const detectFace = async (req, res) => {
  try {
    const { descriptor, teacher } = req.body;

    if (!teacher) {
      return res.status(400).json({ message: "Teacher parameter is required" });
    }

    const result = await faceService.detectFace(descriptor, teacher);

    if (!result || result.length === 0) {
      return res.status(400).json({ message: "Not found face" });
    }

    console.log(result);

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error in detectFace", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  trainFace,
  checkFace,
  detectFace
};
