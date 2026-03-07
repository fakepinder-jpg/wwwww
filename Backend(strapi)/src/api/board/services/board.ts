import { factories } from '@strapi/strapi';

// service de base pour les boards, strapi le gere automatiquement
export default factories.createCoreService('api::board.board');
