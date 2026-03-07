"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// service de base pour les boards, strapi le gere automatiquement
exports.default = strapi_1.factories.createCoreService('api::board.board');
