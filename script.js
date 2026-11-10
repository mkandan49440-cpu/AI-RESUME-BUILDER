
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // GET FORM ELEMENTS
    // =====================================

    const fields = {
        name: document.getElementById("name"),
        jobTitle: document.getElementById("jobTitle"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        location: document.getElementById("location"),

        objective: document.getElementById("objective"),

        degree: document.getElementById("degree"),
        college: document.getElementById("college"),
        graduation: document.getElementById("graduation"),
        percentage: document.getElementById("percentage"),

        skills: document.getElementById("skills"),

        experience: document.getElementById("experience"),
        company: document.getElementById("company"),
        experienceDescription:
            document.getElementById("experienceDescription"),

        project: document.getElementById("project"),
        projectDescription:
            document.getElementById("projectDescription")
    };


    // =====================================
    // GET PREVIEW ELEMENTS
    // =====================================

    const preview = {
        name: document.getElementById("previewName"),
        jobTitle: document.getElementById("previewJob"),
        email: document.getElementById("previewEmail"),
        phone: document.getElementById("previewPhone"),
        location: document.getElementById("previewLocation"),

        objective: document.getElementById("previewObjective"),

        degree: document.getElementById("previewDegree"),
        college: document.getElementById("previewCollege"),
        graduation: document.getElementById("previewGraduation"),
        percentage: document.getElementById("previewPercentage"),

        skills: document.getElementById("previewSkills"),

        experience: document.getElementById("previewExperience"),
        company: document.getElementById("previewCompany"),
        experienceDescription:
            document.getElementById("previewExperienceDescription"),

        project: document.getElementById("previewProject"),
        projectDescription:
            document.getElementById("previewProjectDescription")
    };


    // =====================================
    // PHOTO ELEMENTS
    // =====================================

    const photoInput =
        document.getElementById("photoInput");

    const photoPlaceholder =
        document.getElementById("photoPlaceholder");

    const previewPhoto =
        document.getElementById("previewPhoto");

    let uploadedPhotoURL = null;

    let savedPhotoData = null;


    // =====================================
    // TOAST
    // =====================================

    function showToast(message) {

        const toast = document.getElementById("toast");

        if (!toast) {

            console.log(message);

            return;

        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(window.toastTimer);

        window.toastTimer = setTimeout(function () {

            toast.classList.remove("show");

        }, 3000);

    }

    window.showToast = showToast;


    // =====================================
    // UPDATE TEXT
    // =====================================

    function updateText(element, value, fallback = "") {

        if (!element) return;

        element.textContent = value.trim() || fallback;

    }


    // =====================================
    // SKILLS
    // =====================================

    function updateSkills() {

        if (!preview.skills) return;

        preview.skills.replaceChildren();

        const skills = fields.skills.value
            .split(",")
            .map(function (skill) {

                return skill.trim();

            })
            .filter(function (skill) {

                return skill.length > 0;

            });


        skills.forEach(function (skill) {

            const span = document.createElement("span");

            span.textContent = skill;

            preview.skills.appendChild(span);

        });

    }


    // =====================================
    // HIDE EMPTY SECTIONS
    // =====================================

    function toggleSection(element, visible) {

        if (!element) return;

        const section =
            element.closest(".resume-section");

        if (section) {

            section.style.display =
                visible ? "" : "none";

        }

    }


    // =====================================
    // EDUCATION
    // =====================================

    function updateEducation() {

        const degree =
            fields.degree.value.trim();

        const college =
            fields.college.value.trim();

        const graduation =
            fields.graduation.value.trim();

        const percentage =
            fields.percentage.value.trim();


        updateText(
            preview.degree,
            degree,
            "Degree"
        );

        updateText(
            preview.college,
            college
        );

        updateText(
            preview.graduation,
            graduation
        );

        updateText(
            preview.percentage,
            percentage
        );


        const hasEducation =
            degree !== "" ||
            college !== "" ||
            graduation !== "" ||
            percentage !== "";


        toggleSection(
            preview.degree,
            hasEducation
        );

    }


    // =====================================
    // EXPERIENCE
    // =====================================

    function updateExperience() {

        const job =
            fields.experience.value.trim();

        const company =
            fields.company.value.trim();

        const description =
            fields.experienceDescription.value.trim();


        updateText(
            preview.experience,
            job,
            "Professional Experience"
        );

        updateText(
            preview.company,
            company
        );

        updateText(
            preview.experienceDescription,
            description
        );


        const hasExperience =
            job !== "" ||
            company !== "" ||
            description !== "";


        toggleSection(
            preview.experience,
            hasExperience
        );

    }


    // =====================================
    // PROJECT
    // =====================================

    function updateProject() {

        const project =
            fields.project.value.trim();

        const description =
            fields.projectDescription.value.trim();


        updateText(
            preview.project,
            project,
            "Project Name"
        );

        updateText(
            preview.projectDescription,
            description
        );


        const hasProject =
            project !== "" ||
            description !== "";


        toggleSection(
            preview.project,
            hasProject
        );

    }


    // =====================================
    // UPDATE COMPLETE RESUME
    // =====================================

    function updatePreview() {

        // Personal Information

        updateText(
            preview.name,
            fields.name.value,
            "Your Name"
        );

        updateText(
            preview.jobTitle,
            fields.jobTitle.value,
            "Professional Title"
        );

        updateText(
            preview.email,
            fields.email.value
        );

        updateText(
            preview.phone,
            fields.phone.value
        );

        updateText(
            preview.location,
            fields.location.value
        );


        // Career Objective

        updateText(
            preview.objective,
            fields.objective.value,
            "Career objective not provided."
        );


        // Education

        updateEducation();


        // Skills

        updateSkills();


        // Experience

        updateExperience();


        // Projects

        updateProject();

    }


    // =====================================
    // AUTOMATIC LIVE PREVIEW
    // =====================================

    Object.values(fields).forEach(function (field) {

        if (!field) return;

        field.addEventListener(
            "input",
            updatePreview
        );

        field.addEventListener(
            "change",
            updatePreview
        );

    });


    // =====================================
    // PROFILE PHOTO
    // =====================================

    function displayPhoto(imageURL) {

        if (photoPlaceholder) {

            const image =
                document.createElement("img");

            image.src = imageURL;

            image.alt = "Profile photo";

            photoPlaceholder.replaceChildren(image);

        }


        if (previewPhoto) {

            const image =
                document.createElement("img");

            image.src = imageURL;

            image.alt = "Resume profile photo";

            previewPhoto.replaceChildren(image);

        }

    }


    if (photoInput) {

        photoInput.addEventListener(
            "change",
            function () {

                const file = this.files[0];

                if (!file) return;


                // Validate image type

                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];

                if (!allowedTypes.includes(file.type)) {

                    showToast(
                        "Please select JPG, PNG or WEBP image."
                    );

                    this.value = "";

                    return;

                }


                // Validate image size

                if (file.size > 5 * 1024 * 1024) {

                    showToast(
                        "Image must be smaller than 5 MB."
                    );

                    this.value = "";

                    return;

                }


                // Remove previous object URL

                if (uploadedPhotoURL) {

                    URL.revokeObjectURL(
                        uploadedPhotoURL
                    );

                }


                // Create image URL

                uploadedPhotoURL =
                    URL.createObjectURL(file);


                // Display photo

                displayPhoto(uploadedPhotoURL);


                // Convert photo to Base64

                const reader = new FileReader();

                reader.onload = function (event) {

                    savedPhotoData =
                        event.target.result;

                    showToast(
                        "Profile photo uploaded successfully!"
                    );

                };

                reader.onerror = function () {

                    savedPhotoData = null;

                    showToast(
                        "Unable to read profile image."
                    );

                };

                reader.readAsDataURL(file);

            }
        );

    }


    // =====================================
    // GET FORM DATA
    // =====================================

    function getResumeData() {

        const data = {};

        Object.keys(fields).forEach(function (key) {

            data[key] = fields[key]
                ? fields[key].value
                : "";

        });


        data.photo = savedPhotoData;

        return data;

    }


    // =====================================
    // SAVE RESUME
    // =====================================

    window.saveResume = function () {

        try {

            const resumeData =
                getResumeData();


            localStorage.setItem(
                "aiResumeData",
                JSON.stringify(resumeData)
            );


            showToast(
                "Resume saved successfully!"
            );

        } catch (error) {

            console.error(
                "Resume save error:",
                error
            );

            showToast(
                "Unable to save resume."
            );

        }

    };


    // =====================================
    // LOAD SAVED RESUME
    // =====================================

    function loadResume() {

        try {

            const savedData =
                localStorage.getItem(
                    "aiResumeData"
                );

            if (!savedData) return;


            const data =
                JSON.parse(savedData);


            // Restore form values

            Object.keys(fields).forEach(
                function (key) {

                    if (
                        fields[key] &&
                        data[key] !== undefined
                    ) {

                        fields[key].value =
                            data[key];

                    }

                }
            );


            // Restore photo

            if (data.photo) {

                savedPhotoData =
                    data.photo;

                displayPhoto(data.photo);

            }


        } catch (error) {

            console.error(
                "Resume load error:",
                error
            );

            showToast(
                "Unable to load saved resume."
            );

        }

    }


    // =====================================
    // CLEAR FORM
    // =====================================

    window.clearForm = function () {

        const confirmed = confirm(
            "Are you sure you want to clear all resume details?"
        );

        if (!confirmed) return;


        // Clear fields

        Object.values(fields).forEach(
            function (field) {

                if (field) {

                    field.value = "";

                }

            }
        );


        // Clear photo URL

        if (uploadedPhotoURL) {

            URL.revokeObjectURL(
                uploadedPhotoURL
            );

            uploadedPhotoURL = null;

        }


        savedPhotoData = null;


        // Clear file input

        if (photoInput) {

            photoInput.value = "";

        }


        // Clear photo display

        if (photoPlaceholder) {

            photoPlaceholder.textContent = "👤";

        }

        if (previewPhoto) {

            previewPhoto.textContent = "👤";

        }


        // Clear saved resume

        localStorage.removeItem(
            "aiResumeData"
        );


        // Clear ATS saved score

        localStorage.removeItem(
            "aiResumeATSScore"
        );


        // Refresh preview

        updatePreview();


        // Hide ATS results

        const atsResult =
            document.getElementById("atsResult");

        if (atsResult) {

            atsResult.classList.remove("show");

        }


        showToast(
            "Resume form cleared!"
        );

    };


    // =====================================
    // DOWNLOAD RESUME / PDF
    // =====================================

    window.downloadResume = function () {

        updatePreview();

        window.print();

    };


    // =====================================
    // ATS SCORE CHECKER
    // =====================================

    window.checkATSScore = function () {

        const atsResult =
            document.getElementById("atsResult");

        const atsScore =
            document.getElementById("atsScore");

        const atsMessage =
            document.getElementById("atsMessage");

        const atsProgressBar =
            document.getElementById("atsProgressBar");

        const atsChecklist =
            document.getElementById("atsChecklist");

        const atsSuggestions =
            document.getElementById("atsSuggestions");


        // Check HTML elements

        if (
            !atsResult ||
            !atsScore ||
            !atsMessage ||
            !atsProgressBar ||
            !atsChecklist ||
            !atsSuggestions
        ) {

            showToast(
                "ATS HTML elements missing. Add ATS result HTML."
            );

            return;

        }


        // =====================================
        // GET RESUME VALUES
        // =====================================

        const name =
            fields.name.value.trim();

        const jobTitle =
            fields.jobTitle.value.trim();

        const email =
            fields.email.value.trim();

        const phone =
            fields.phone.value.trim();

        const location =
            fields.location.value.trim();

        const objective =
            fields.objective.value.trim();

        const degree =
            fields.degree.value.trim();

        const college =
            fields.college.value.trim();

        const graduation =
            fields.graduation.value.trim();

        const percentage =
            fields.percentage.value.trim();

        const skills =
            fields.skills.value.trim();

        const experience =
            fields.experience.value.trim();

        const company =
            fields.company.value.trim();

        const experienceDescription =
            fields.experienceDescription.value.trim();

        const project =
            fields.project.value.trim();

        const projectDescription =
            fields.projectDescription.value.trim();


        // =====================================
        // SKILLS ARRAY
        // =====================================

        const skillsArray = skills
            .split(",")
            .map(function (skill) {

                return skill.trim();

            })
            .filter(function (skill) {

                return skill.length > 0;

            });


        // =====================================
        // EDUCATION CHECK
        // =====================================

        const hasEducation =
            degree !== "" &&
            college !== "" &&
            graduation !== "";


        // =====================================
        // EXPERIENCE CHECK
        // =====================================

        const hasExperience =
            experience !== "" &&
            company !== "" &&
            experienceDescription.length >= 30;


        // =====================================
        // PROJECT CHECK
        // =====================================

        const hasProject =
            project !== "" &&
            projectDescription.length >= 30;


        // =====================================
        // CONTENT CHECK
        // =====================================

        const totalContent =
            objective +
            skills +
            experienceDescription +
            projectDescription;


        // =====================================
        // ATS CHECKLIST
        // =====================================

        const checks = [

            {
                name: "Full Name",

                passed:
                    name.length >= 2,

                suggestion:
                    "Enter your complete name."
            },

            {
                name: "Email Address",

                passed:
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email),

                suggestion:
                    "Enter a valid email address."
            },

            {
                name: "Phone Number",

                passed:
                    /^[+]?[\d\s()-]{7,20}$/
                    .test(phone),

                suggestion:
                    "Enter a valid contact number."
            },

            {
                name: "Professional Title",

                passed:
                    jobTitle.length >= 3,

                suggestion:
                    "Add your target job title, such as Java Developer."
            },

            {
                name: "Career Objective",

                passed:
                    objective.length >= 50,

                suggestion:
                    "Write a meaningful career objective with at least 50 characters."
            },

            {
                name: "Skills",

                passed:
                    skillsArray.length >= 3,

                suggestion:
                    "Add at least 3 relevant skills separated by commas."
            },

            {
                name: "Education",

                passed:
                    hasEducation,

                suggestion:
                    "Complete your degree, college and graduation year."
            },

            {
                name: "Percentage / CGPA",

                passed:
                    percentage !== "",

                suggestion:
                    "Add your percentage or CGPA."
            },

            {
                name: "Experience",

                passed:
                    hasExperience,

                suggestion:
                    "Add job role, company and responsibilities. Freshers can add internships or practical experience."
            },

            {
                name: "Projects",

                passed:
                    hasProject,

                suggestion:
                    "Add project name and a meaningful project description."
            },

            {
                name: "Resume Content",

                passed:
                    totalContent.length >= 150,

                suggestion:
                    "Add more relevant information to your resume."
            }

        ];


        // =====================================
        // CALCULATE ATS SCORE
        // =====================================

        const totalChecks =
            checks.length;

        const completedChecks =
            checks.filter(function (check) {

                return check.passed;

            }).length;


        const score = Math.round(
            (
                completedChecks /
                totalChecks
            ) * 100
        );


        // =====================================
        // DISPLAY SCORE
        // =====================================

        atsScore.textContent =
            score + "%";


        // =====================================
        // SCORE MESSAGE
        // =====================================

        let message = "";


        if (score >= 90) {

            message =
                "Excellent! Your resume is well completed.";

        } else if (score >= 70) {

            message =
                "Good resume! Improve the remaining sections.";

        } else if (score >= 50) {

            message =
                "Average resume. Add more important details.";

        } else {

            message =
                "Your resume needs more information.";

        }


        atsMessage.textContent =
            message;


        // =====================================
        // PROGRESS BAR
        // =====================================

        atsProgressBar.style.width =
            "0%";


        setTimeout(function () {

            atsProgressBar.style.width =
                score + "%";

        }, 100);


        // =====================================
        // SCORE CIRCLE
        // =====================================

        const scoreCircle =
            document.querySelector(
                ".ats-score-circle"
            );


        if (scoreCircle) {

            if (score >= 90) {

                scoreCircle.style.borderColor =
                    "#16a34a";

                atsScore.style.color =
                    "#16a34a";

            } else if (score >= 70) {

                scoreCircle.style.borderColor =
                    "#2563eb";

                atsScore.style.color =
                    "#2563eb";

            } else {

                scoreCircle.style.borderColor =
                    "#f97316";

                atsScore.style.color =
                    "#f97316";

            }

        }


        // =====================================
        // DISPLAY CHECKLIST
        // =====================================

        atsChecklist.replaceChildren();


        checks.forEach(function (check) {

            const item =
                document.createElement("div");

            item.className =
                "ats-check-item";


            const label =
                document.createElement("span");

            label.textContent =
                check.name;


            const status =
                document.createElement("strong");


            if (check.passed) {

                status.textContent =
                    "✓ Complete";

                status.style.color =
                    "#16a34a";

            } else {

                status.textContent =
                    "✗ Missing";

                status.style.color =
                    "#dc2626";

            }


            item.appendChild(label);

            item.appendChild(status);

            atsChecklist.appendChild(item);

        });


        // =====================================
        // DISPLAY SUGGESTIONS
        // =====================================

        atsSuggestions.replaceChildren();


        const missingChecks =
            checks.filter(function (check) {

                return !check.passed;

            });


        if (missingChecks.length === 0) {

            const success =
                document.createElement("div");

            success.className =
                "ats-suggestion";

            success.style.background =
                "#f0fdf4";

            success.style.borderLeftColor =
                "#16a34a";

            success.textContent =
                "Great! All resume checklist items are complete.";

            atsSuggestions.appendChild(
                success
            );

        } else {

            missingChecks.forEach(
                function (check) {

                    const suggestion =
                        document.createElement("div");

                    suggestion.className =
                        "ats-suggestion";

                    suggestion.textContent =
                        "⚠ " + check.suggestion;

                    atsSuggestions.appendChild(
                        suggestion
                    );

                }
            );

        }


        // =====================================
        // SHOW ATS RESULT
        // =====================================

        atsResult.classList.add("show");


        // =====================================
        // SAVE ATS SCORE
        // =====================================

        try {

            localStorage.setItem(
                "aiResumeATSScore",
                JSON.stringify({

                    score: score,

                    completed:
                        completedChecks,

                    total:
                        totalChecks,

                    checkedAt:
                        new Date().toISOString()

                })
            );

        } catch (error) {

            console.error(
                "ATS score save error:",
                error
            );

        }


        // =====================================
        // SCROLL TO RESULT
        // =====================================

        atsResult.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });


        showToast(
            "ATS Resume Score: " + score + "%"
        );

    };


    // =====================================
    // GENERATE CAREER OBJECTIVE
    // =====================================

    window.generateObjective = async function () {

        const name =
            fields.name.value.trim();

        const jobTitle =
            fields.jobTitle.value.trim();

        const skills =
            fields.skills.value.trim();


        if (!jobTitle) {

            showToast(
                "Please enter your professional title."
            );

            fields.jobTitle.focus();

            return;

        }


        const button =
            document.querySelector(".ai-btn");


        const originalText = button
            ? button.textContent
            : "✨ Generate AI Objective";


        if (button) {

            button.disabled = true;

            button.textContent =
                "✨ Generating...";

        }


        try {

            // =====================================
            // AI BACKEND
            // =====================================

            const response = await fetch(
                "http://localhost:5000/api/generate-objective",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        name: name,

                        jobTitle: jobTitle,

                        skills: skills

                    })

                }
            );


            if (!response.ok) {

                throw new Error(
                    "AI backend returned HTTP " +
                    response.status
                );

            }


            const result =
                await response.json();


            if (

                result.success &&

                typeof result.objective ===
                    "string" &&

                result.objective.trim()

            ) {

                fields.objective.value =
                    result.objective.trim();


                updatePreview();


                showToast(
                    "AI objective generated successfully!"
                );

            } else {

                throw new Error(
                    "Invalid AI response."
                );

            }


        } catch (error) {

            console.error(
                "AI Objective error:",
                error
            );


            // =====================================
            // LOCAL FALLBACK
            // =====================================

            const generatedObjective =
                createLocalObjective(
                    jobTitle,
                    skills
                );


            fields.objective.value =
                generatedObjective;


            updatePreview();


            showToast(
                "Objective generated using local template."
            );

        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    originalText;

            }

        }

    };


    // =====================================
    // LOCAL OBJECTIVE GENERATOR
    // =====================================

    function createLocalObjective(
        jobTitle,
        skills
    ) {

        const cleanTitle =
            jobTitle.trim();

        const cleanSkills =
            skills.trim();


        if (cleanSkills) {

            return (

                "Motivated " +

                cleanTitle +

                " seeking an opportunity to apply skills in " +

                cleanSkills +

                ", develop innovative solutions, contribute to team success, " +

                "and grow professionally."

            );

        }


        return (

            "Motivated " +

            cleanTitle +

            " seeking an opportunity to apply technical knowledge, " +

            "develop innovative solutions, contribute to organizational " +

            "growth, and enhance professional skills."

        );

    }


    // =====================================
    // INITIALIZE
    // =====================================

    loadResume();

    updatePreview();


});
