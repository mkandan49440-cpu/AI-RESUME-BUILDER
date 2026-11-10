
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const { spawn } = require("child_process");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ai_resume_system"
});

// MySQL connect
db.connect((err) => {

    if (err) {
        console.log("MySQL Connection Failed:", err.message);
        return;
    }

    console.log("MySQL Connected Successfully!");

});

// Python ML Model Prediction
function predictJobRole(skills) {

    return new Promise((resolve, reject) => {

        // Correct ML model path
        const pythonFile = path.join(
            __dirname,
            "..",
            "ML-MODEL",
            "predict.py"
        );

        console.log("Python File:", pythonFile);
        console.log("Skills:", skills);

        // Run Python
        const python = spawn("python", [
            pythonFile,
            skills
        ]);

        let result = "";
        let error = "";

        // Python output
        python.stdout.on("data", (data) => {

            const output = data.toString();

            console.log("Python Output:", output);

            result += output;

        });

        // Python errors
        python.stderr.on("data", (data) => {

            const output = data.toString();

            console.log("Python Error:", output);

            error += output;

        });

        // Spawn error
        python.on("error", (err) => {

            console.log("Python Spawn Error:", err.message);

            reject(err);

        });

        // Python process completed
        python.on("close", (code) => {

            console.log("Python Exit Code:", code);
            console.log("Python Final Output:", result);
            console.log("Python Final Error:", error);

            if (code !== 0) {

                reject(
                    new Error(error || "Python model failed")
                );

                return;

            }

            if (!result.trim()) {

                reject(
                    new Error("Python model returned empty output")
                );

                return;

            }

            resolve(result.trim());

        });

    });

}

// Home route
app.get("/", (req, res) => {

    res.send("AI Resume Builder Backend Running");

});

// Test MySQL
app.get("/api/test-db", (req, res) => {

    db.query("SELECT 1 AS result", (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "MySQL Connection Failed",
                error: err.message
            });

        }

        res.json({
            success: true,
            message: "MySQL Connected Successfully"
        });

    });

});

// Test ML Model
app.post("/api/predict-role", async (req, res) => {

    try {

        const skills = req.body.skills;

        if (
            typeof skills !== "string" ||
            !skills.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter skills"
            });

        }

        console.log("ML Prediction Started");

        const predictedRole = await predictJobRole(
            skills.trim()
        );

        console.log("Predicted Role:", predictedRole);

        res.json({
            success: true,
            predictedRole: predictedRole
        });

    } catch (error) {

        console.log("ML Prediction Failed:", error.message);

        res.status(500).json({
            success: false,
            message: "ML Prediction Failed",
            error: error.message
        });

    }

});

// Generate Career Objective
app.post("/api/generate-objective", async (req, res) => {

    try {

        const skills = req.body.skills;

        if (
            typeof skills !== "string" ||
            !skills.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter skills"
            });

        }

        const role = await predictJobRole(
            skills.trim()
        );

        const objective =
            `Seeking a ${role} position where I can apply my ` +
            `${skills.trim()} skills, improve my technical knowledge, ` +
            `and contribute to organizational growth.`;

        res.json({
            success: true,
            predictedRole: role,
            careerObjective: objective
        });

    } catch (error) {

        console.log("Objective Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Career Objective Generation Failed",
            error: error.message
        });

    }

});

// Save Resume
app.post("/api/resumes", (req, res) => {

    const {
        name,
        email,
        phone,
        education,
        skills,
        projects,
        career_objective
    } = req.body;

    if (!name || !email) {

        return res.status(400).json({
            success: false,
            message: "Name and Email are required"
        });

    }

    const sql = `
        INSERT INTO resumes
        (
            name,
            email,
            phone,
            education,
            skills,
            projects,
            career_objective
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        email,
        phone || "",
        education || "",
        skills || "",
        projects || "",
        career_objective || ""
    ];

    db.query(sql, values, (err, result) => {

        if (err) {

            console.log("Resume Save Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Resume Save Failed",
                error: err.message
            });

        }

        res.status(201).json({
            success: true,
            message: "Resume Saved Successfully!",
            resumeId: result.insertId
        });

    });

});

// Get All Resumes
app.get("/api/resumes", (req, res) => {

    const sql = `
        SELECT *
        FROM resumes
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Resumes",
                error: err.message
            });

        }

        res.json({
            success: true,
            resumes: results
        });

    });

});

// Get Resume By ID
app.get("/api/resumes/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM resumes WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to Fetch Resume",
                    error: err.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Resume Not Found"
                });

            }

            res.json({
                success: true,
                resume: results[0]
            });

        }
    );

});

// Delete Resume
app.delete("/api/resumes/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM resumes WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Resume Delete Failed",
                    error: err.message
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Resume Not Found"
                });

            }

            res.json({
                success: true,
                message: "Resume Deleted Successfully"
            });

        }
    );

});

// Start Server
app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
