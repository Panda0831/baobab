import React, { useEffect, useState } from 'react'

const MobileCta: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const contact = document.getElementById('contact')
    let contactInView = false

    function update() {
      setVisible(window.scrollY > 680 && !contactInView)
    }

    const observer = contact
      ? new IntersectionObserver((entries) => {
          contactInView = entries[0]?.isIntersecting ?? false
          update()
        }, { rootMargin: '0px 0px -20% 0px' })
      : null

    if (contact && observer) observer.observe(contact)
    window.addEventListener('scroll', update, { passive: true })
    update()

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <div className={`mobile-cta${visible ? ' is-visible' : ''}`}>
      <a href="#contact" className="mobile-cta-link">
        Parlons de votre projet <span aria-hidden="true">↗</span>
      </a>
    </div>
  )
}

export default MobileCta
