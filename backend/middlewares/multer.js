import multer from "multer";

const storage = multer.memoryStorage(); // Keeps the file in RAM

const upload = multer({ storage });

export default upload;
