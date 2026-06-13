import { Navbar } from '@/components/navbar/Navbar'
import { WelcomeScreen } from '@/components/overlays/WelcomeScreen'
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
      <WelcomeScreen />
      <AssistantPanel />
      <ResumeOverlay />
      <ProjectOverlay />

      {/* Navbar — pins after workspace scroll */}
      <Navbar />

      {/* Workspace hero placeholder — built separately */}
      <div
        id="workspace-hero"
        style={{
          height: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}
        >
          {/* Workspace 3D scene goes here */}
          workspace_hero.tsx
        </p>
      </div>

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