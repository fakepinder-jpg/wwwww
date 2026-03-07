"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// service de base pour les listes, strapi gere tout automatiquement
exports.default = strapi_1.factories.createCoreService('api::list.list');
