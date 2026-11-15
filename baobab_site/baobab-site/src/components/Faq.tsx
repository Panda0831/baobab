import React from 'react'

const questions = [
  {
    question: 'Combien de temps prend un projet ?',
    answer: 'Un site vitrine se conçoit généralement en quelques semaines ; une application métier avance par étapes successives. Nous donnons un calendrier réaliste après le cadrage, et nous le mettons à jour si le périmètre évolue.',
  },
  {
    question: 'Nous avons déjà un site : faut-il tout refaire ?',
    answer: 'Pas nécessairement. Nous commençons par regarder ce qui fonctionne, ce qui freine vos utilisateurs et ce qui peut être conservé. La refonte peut être partielle, progressive ou complète selon le diagnostic.',
  },
  {
    question: 'Comment se déroule la collaboration ?',
    answer: 'Vous avez un interlocuteur identifié, des points réguliers et un accès aux versions en cours. Nous privilégions les démonstrations concrètes aux longs documents.',
  },
  {
    question: 'Travaillez-vous avec nos équipes techniques ?',
    answer: 'Oui. Nous pouvons nous intégrer à une équipe existante, reprendre un code déjà en place ou préparer une documentation claire pour une passation.',
  },
  {
    question: 'Et après la mise en ligne ?',
    answer: 'Nous assurons la prise en main, les corrections et les évolutions. Vous restez propriétaire de votre produit et de vos données.',
  },
]

const Faq: React.FC = () => {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">Questions fréquentes</span>
          <h2 id="faq-title">Ce que les porteurs de projet demandent souvent.</h2>
          <p>Une question qui n’est pas ici ? Écrivez-nous, nous répondons simplement.</p>
          <a href="#contact" className="text-link">Poser votre question <span aria-hidden="true">↗</span></a>
        </div>
        <div className="faq-list">
          {questions.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>
                <span>{item.question}</span>
                <i aria-hidden="true">+</i>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
