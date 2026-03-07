"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// service de base pour les labels, strapi s'occupe de tout
exports.default = strapi_1.factories.createCoreService('api::label.label');
