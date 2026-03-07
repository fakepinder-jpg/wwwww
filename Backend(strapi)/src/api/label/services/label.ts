import { factories } from '@strapi/strapi';

// service de base pour les labels, strapi s'occupe de tout
export default factories.createCoreService('api::label.label');
