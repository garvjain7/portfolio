import os

base_path = "frontend"

files = [
    # Root
    ".env.local",
    "next.config.js",
    "tailwind.config.js",
    "tsconfig.json",
    "package.json",

    # Public
    "public/fonts/.gitkeep",
    "public/icons/.gitkeep",
    "public/sounds/.gitkeep",

    # App
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/globals.css",
    "src/app/favicon.ico",

    # Components - Workspace
    "src/components/workspace/WorkspaceHero.tsx",
    "src/components/workspace/WorkspaceCanvas.tsx",
    "src/components/workspace/WorkspaceRoom.tsx",
    "src/components/workspace/WorkspaceHotspots.tsx",
    "src/components/workspace/PortalAnimation.tsx",
    "src/components/workspace/GuideTooltip.tsx",
    "src/components/workspace/WorkspaceScrollFade.tsx",

    # Components - Sections
    "src/components/sections/ProjectsSection.tsx",
    "src/components/sections/ExperienceSection.tsx",
    "src/components/sections/CertificationsSection.tsx",
    "src/components/sections/DashboardSection.tsx",
    "src/components/sections/SkillsSection.tsx",
    "src/components/sections/AboutSection.tsx",
    "src/components/sections/ContactSection.tsx",
    "src/components/sections/AchievementsSection.tsx",

    # Components - Assistant
    "src/components/assistant/AssistantPanel.tsx",
    "src/components/assistant/AssistantChat.tsx",
    "src/components/assistant/AssistantInput.tsx",
    "src/components/assistant/AssistantMessage.tsx",
    "src/components/assistant/VoiceInput.tsx",

    # Components - Navbar
    "src/components/navbar/Navbar.tsx",
    "src/components/navbar/NavAssistantButton.tsx",

    # Components - Overlays
    "src/components/overlays/ProjectOverlay.tsx",
    "src/components/overlays/WelcomeScreen.tsx",
    "src/components/overlays/ResumeOverlay.tsx",

    # Components - UI
    "src/components/ui/button.tsx",
    "src/components/ui/badge.tsx",
    "src/components/ui/tooltip.tsx",

    # Hooks
    "src/hooks/useScrollFade.ts",
    "src/hooks/useAssistant.ts",
    "src/hooks/useVoiceInput.ts",
    "src/hooks/useSectionNav.ts",
    "src/hooks/useAnimatedCounter.ts",

    # Lib
    "src/lib/api.ts",
    "src/lib/stream.ts",
    "src/lib/constants.ts",

    # Stores
    "src/stores/uiStore.ts",

    # Types
    "src/types/assistant.ts",
    "src/types/projects.ts",
]

for file_path in files:
    full_path = os.path.join(base_path, file_path)

    # Create parent directories if needed
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    # Skip existing files
    if os.path.exists(full_path):
        continue

    # Create empty file
    with open(full_path, "w", encoding="utf-8"):
        pass

print("Frontend structure created successfully.")