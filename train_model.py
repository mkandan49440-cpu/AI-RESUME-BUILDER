
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
import joblib

# Training data: Skills
skills = [
    "java mysql spring boot jdbc",
    "java spring boot rest api",
    "html css javascript",
    "html css javascript react",
    "python pandas numpy excel",
    "python data analysis statistics",
    "python machine learning pandas numpy",
    "python tensorflow machine learning"
]

# Expected job roles
job_roles = [
    "Java Developer",
    "Java Developer",
    "Frontend Developer",
    "Frontend Developer",
    "Data Analyst",
    "Data Analyst",
    "Machine Learning Engineer",
    "Machine Learning Engineer"
]

# Create ML model
model = Pipeline([
    ("vectorizer", TfidfVectorizer()),
    ("classifier", LogisticRegression())
])

# Train model
model.fit(skills, job_roles)

# Save trained model
joblib.dump(model, "resume_model.pkl")

print("ML Model Training Completed!")

# Test model
test_skills = ["java mysql spring boot"]

prediction = model.predict(test_skills)

print("Predicted Job Role:", prediction[0])
