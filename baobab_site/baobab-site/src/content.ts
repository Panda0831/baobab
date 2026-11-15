export type ServiceIcon = 'web' | 'mobile' | 'backend' | 'ai' | 'data' | 'advice'

export interface Service {
  id: string
  icon: ServiceIcon
  title: string
  shortTitle: string
  description: string
}

export const services: Service[] = [
  {
    id: 'web',
    icon: 'web',
    title: 'Développement web',
    shortTitle: 'Site ou application web',
    description: 'Des sites et applications rapides, accessibles, pensés pour vos clients.',
  },
  {
    id: 'mobile',
    icon: 'mobile',
    title: 'Applications mobiles',
    shortTitle: 'Application mobile',
    description: 'Des expériences mobiles utiles, pensées pour le terrain.',
  },
  {
    id: 'backend',
    icon: 'backend',
    title: 'Logiciel & backend',
    shortTitle: 'Logiciel métier & backend',
    description: 'Des fondations fiables pour relier vos outils, vos données, vos processus.',
  },
  {
    id: 'ai',
    icon: 'ai',
    title: 'IA & automatisation',
    shortTitle: 'IA & automatisation',
    description: 'Repérez les tâches répétitives, automatisez ce qui peut l’être.',
  },
  {
    id: 'data',
    icon: 'data',
    title: 'Data & solutions intelligentes',
    shortTitle: 'Data & tableaux de bord',
    description: 'Vos informations structurées et lisibles pour éclairer chaque décision.',
  },
  {
    id: 'advice',
    icon: 'advice',
    title: 'Conseil numérique',
    shortTitle: 'Conseil & cadrage',
    description: 'Du cadrage à la mise en œuvre, avec une équipe proche et impliquée.',
  },
]

export const site = {
  name: 'Baobab',
  /**
   * Adresse utilisée pour préparer l'e-mail depuis le formulaire de contact.
   * À remplacer par l'adresse réelle de l'équipe avant la mise en ligne.
   */
  email: 'contact@baobab.mg',
}

/** Événement émis quand une carte de service veut préremplir le formulaire. */
export const SERVICE_EVENT = 'baobab:service'

export function requestService(serviceId: string) {
  window.dispatchEvent(new CustomEvent(SERVICE_EVENT, { detail: serviceId }))
}
