import { Navbar } from '@/components/navbar/Navbar'
import { Workspace } from '@/components/workspace/Workspace'
import { WorkspaceHero } from '@/components/workspace/WorkspaceHero'
import { ResumeOverlay } from '@/components/overlays/ResumeOverlay'
import { ProjectOverlay } from '@/components/overlays/ProjectOverlay'
import { AssistantPanel } from '@/components/assistant/AssistantPanel'
import { AboutSection } from '@/components/sections/AboutSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { CertificationsSection } from '@/components/sections/CertificationsSection'
import { AchievementsSection } from '@/components/sections/AchievementsSection'
import { DashboardSection } from '@/components/sections/DashboardSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <>
      {/* Overlays + panels — rendered above everything */}
      <AssistantPanel />
      <ResumeOverlay />
      <ProjectOverlay />

      {/* Navbar — pins after workspace scroll */}
      <Navbar />

      {/* Coordinated intro sequence and video hero */}
      <Workspace>
        <WorkspaceHero />
      </Workspace>

      {/* Main content — all scroll sections */}
      <main>
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <CertificationsSection />
        <AchievementsSection />
        <DashboardSection />
        <ContactSection />
      </main>
    </>
  )
}