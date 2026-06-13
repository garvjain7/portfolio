from pathlib import Path

# Run this script from the project root
# where knowledge_base/ already exists

KB = Path("knowledge_base")

# Root-level files
root_files = [
    "identity.md",
    "education.md",
    "experience.md",
    "certifications.md",
    "skills_deep.md",
    "technical_philosophy.md",
    "system_design_approach.md",
    "engineering_narrative.md",
    "career_goals.md",
    "lessons_learned.md",
    "role_fit.md",
    "faq.md",
]

# Projects folder files
project_files = [
    "project_index.md",
    "scanvista.md",
    "datainsights.md",
    "codealive.md",
    "apnaev.md",
    "complysense.md",
    "uiaudit.md",
    "other_projects_advanced.md",
    "other_projects_basic.md",
]

# Ensure directories exist
(KB / "projects").mkdir(parents=True, exist_ok=True)

# Create root files if missing
for file_name in root_files:
    file_path = KB / file_name
    file_path.touch(exist_ok=True)

# Create project files if missing
for file_name in project_files:
    file_path = KB / "projects" / file_name
    file_path.touch(exist_ok=True)

print("Knowledge base structure created successfully.")