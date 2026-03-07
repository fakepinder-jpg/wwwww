"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes de l'API pour les tableaux (boards)
exports.default = {
    routes: [
        {
            method: 'GET', // recuperer tous les boards
            path: '/boards',
            handler: 'board.find',
            config: { auth: { scope: [] } },
        },
        {
            method: 'GET', // recuperer un board par son id
            path: '/boards/:id',
            handler: 'board.findOne',
            config: { auth: { scope: [] } },
        },
        {
            method: 'POST', // creer un nouveau board
            path: '/boards',
            handler: 'board.create',
            config: {
                auth: { scope: [] },
                policies: [],
            },
        },
        {
            method: 'PUT', // modifier un board
            path: '/boards/:id',
            handler: 'board.update',
            config: { auth: { scope: [] } },
        },
        {
            method: 'DELETE', // supprimer un board
            path: '/boards/:id',
            handler: 'board.delete',
            config: { auth: { scope: [] } },
        },
    ],
};
