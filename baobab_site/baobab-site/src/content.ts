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
    description: 'Des sites et applications rapides, accessibles et conçus autour des usages de vos clients.',
  },
  {
    id: 'mobile',
    icon: 'mobile',
    title: 'Applications mobiles',
    shortTitle: 'Application mobile',
    description: 'Des expériences mobiles utiles, pensées pour accompagner les usages sur le terrain.',
  },
  {
    id: 'backend',
    icon: 'backend',
    title: 'Logiciel & backend',
    shortTitle: 'Logiciel métier & backend',
    description: 'Des fondations fiables pour relier vos outils, vos données et vos processus métier.',
  },
  {
    id: 'ai',
    icon: 'ai',
    title: 'IA & automatisation',
    shortTitle: 'IA & automatisation',
    description: 'Identifiez les tâches répétitives et imaginez des automatisations adaptées à votre activité.',
  },
  {
    id: 'data',
    icon: 'data',
    title: 'Data & solutions intelligentes',
    shortTitle: 'Data & tableaux de bord',
    description: 'Structurez et rendez vos informations plus faciles à lire pour éclairer vos décisions.',
  },
  {
    id: 'advice',
    icon: 'advice',
    title: 'Conseil numérique',
    shortTitle: 'Conseil & cadrage',
    description: 'Du cadrage à la mise en œuvre, avancez avec une équipe proche et impliquée.',
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
