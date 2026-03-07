import { factories } from '@strapi/strapi';

// service de base pour les cartes, strapi gere tout automatiquement
export default factories.createCoreService('api::card.card');
