import { factories } from '@strapi/strapi';

// service de base pour les listes, strapi gere tout automatiquement
export default factories.createCoreService('api::list.list');
