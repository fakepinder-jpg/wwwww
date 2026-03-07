"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// controlleur de base pour les labels, strapi gere tout
exports.default = strapi_1.factories.createCoreController('api::label.label');
