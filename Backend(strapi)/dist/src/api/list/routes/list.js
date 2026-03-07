"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// les routes de l'api pour les listes
exports.default = {
    routes: [
        {
            method: 'GET', // recupere toutes les listes
            path: '/lists',
            handler: 'list.find',
            config: {
                auth: { scope: [] },
            },
        },
        {
            method: 'GET', // recupere une liste par son id
            path: '/lists/:id',
            handler: 'list.findOne',
            config: {
                auth: { scope: [] },
            },
        },
        {
            method: 'POST', // cree une nouvelle liste
            path: '/lists',
            handler: 'list.create',
            config: {
                auth: { scope: [] },
            },
        },
        {
            method: 'PUT', // modifie une liste existante
            path: '/lists/:id',
            handler: 'list.update',
            config: {
                auth: { scope: [] },
            },
        },
        {
            method: 'DELETE', // supprime une liste
            path: '/lists/:id',
            handler: 'list.delete',
            config: {
                auth: { scope: [] },
            },
        },
    ],
};
