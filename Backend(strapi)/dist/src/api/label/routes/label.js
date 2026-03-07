"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// routes generees automatiquement par strapi pour les labels
exports.default = strapi_1.factories.createCoreRouter('api::label.label');
