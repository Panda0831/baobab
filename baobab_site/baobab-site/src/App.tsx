import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import PlatformPreview from './components/PlatformPreview'
import About from './components/About'
import Process from './components/Process'
import Team from './components/Team'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Contact from './components/Contact'
import MobileCta from './components/MobileCta'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <Navbar />
        <main id="contenu">
          <Hero />
          <Features />
          <PlatformPreview />
          <About />
          <Process />
          <Team />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <MobileCta />
      </div>
    </MotionConfig>
  )
}

export default App
