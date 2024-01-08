const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
const multer = require("multer");
const express = require("express");
const compression = require("compression");

const { encryptData, decompressAndDecryptData } = require("./utils/crypto");
const { saveToCloud, deleteFromCloud } = require("./utils/storage");

const { Project } = require("./models/project");
const { LocalProject } = require("./models/localProject");

dotenv.config();

// const key = "36a3522667402c020d9ecdb05b5fd549fea02f56a8bd8aa2215a27e78161dfb4";
const key = process.env.SECRET_KEY;

// Define a multer storage strategy for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(16).toString("hex")); // Use a random file name
  }
});

const app = express();
const upload = multer({ storage });

const port = process.env.PORT || 3000;

app.use(cors());
app.use(compression({ threshold: 0 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/api/files", express.static("files"));

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const { file } = req;

  try {
    const fileData = fs.readFileSync(file.path); // Read the file from the disk

    const encryptedProject = encryptData(fileData, key);

    const id = crypto.randomBytes(16).toString("hex");

    const { url } = await saveToCloud(encryptedProject, id);

    const projectId = crypto.randomBytes(16).toString("hex");

    const project = {
      id,
      projectId,
      url
    };

    await Project.forge().save(project, {
      method: "insert"
    });

    res.json({ message: "success", project });
  } catch (e) {
    deleteFromCloud(file.filename);

    res.status(500).json({ message: e.message ?? e });
  } finally {
    fs.unlink(`./uploads/${file.filename}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
});

app.post("/api/local-sync/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.forge().where({ id }).fetch();

    const { url } = project.toJSON();

    const file = await axios.get(url);

    const { data } = file;

    const decompressedAndDecryptedData = decompressAndDecryptData(data, key);

    const projectObject = JSON.parse(decompressedAndDecryptedData);

    const localProject = {
      ...projectObject,
      id,
      projectId: projectObject.projectId
    };

    await LocalProject.forge().save(localProject, {
      method: "insert"
    });

    res.json({
      message: "success",
      project: localProject
    });
  } catch (e) {
    res.status(500).json({ message: e.message ?? e });
  }
});

app.get("/api/project", async (_req, res) => {
  try {
    const projects = await Project.fetchAll();

    res.json(projects);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/api/local", async (_req, res) => {
  try {
    const projects = await LocalProject.fetchAll();

    res.json(projects);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.listen(port, () => {
  console.log(`The server is up at port ${port}!`);
});
