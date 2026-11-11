import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import PlatformPreview from './components/PlatformPreview'
import About from './components/About'
import Team from './components/Team'
import Footer from './components/Footer'
import Contact from './components/Contact'

function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <Navbar />
      <main id="contenu">
        <Hero />
        <Features />
        <PlatformPreview />
        <About />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
