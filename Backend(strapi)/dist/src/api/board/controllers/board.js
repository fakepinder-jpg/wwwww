"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// controleur des tableaux (board), gere le CRUD
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::board.board', ({ strapi }) => ({
    // crée un nouveau tableau pour l'utilisateur connecté
    async create(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.unauthorized('Utilisateur non connecté');
        const { title } = ctx.request.body.data;
        if (!title)
            return ctx.badRequest('Le titre est requis');
        // on associe le board a l'user qui le cree
        const entity = await strapi.db.query('api::board.board').create({
            data: { title, owner: user.id },
        });
        return this.transformResponse(entity);
    },
    // recupere tous les tableaux de l'user connecté
    async find(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.unauthorized();
        const entities = await strapi.db.query('api::board.board').findMany({
            where: { owner: user.id },
            orderBy: { createdAt: 'desc' },
            // on inclut les listes, les cartes et les labels
            populate: {
                lists: {
                    populate: {
                        cards: {
                            populate: ['labels'],
                        },
                    },
                },
            },
        });
        return this.transformResponse(entities);
    },
    // recupere un seul tableau avec toutes ses données
    async findOne(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.unauthorized();
        const { id } = ctx.params;
        const entity = await strapi.db.query('api::board.board').findOne({
            where: { id: Number(id) },
            populate: {
                owner: true,
                lists: {
                    populate: {
                        cards: {
                            populate: ['labels'],
                        },
                    },
                },
            },
        });
        if (!entity)
            return ctx.notFound('Board introuvable');
        // on verifie que c'est bien son tableau
        if (!entity.owner || entity.owner.id !== user.id)
            return ctx.forbidden('Non autorisé');
        return this.transformResponse(entity);
    },
    // renomme un tableau
    async update(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.unauthorized();
        const { id } = ctx.params;
        const board = await strapi.db.query('api::board.board').findOne({
            where: { id: Number(id) },
            populate: ['owner'],
        });
        if (!board)
            return ctx.notFound('Board introuvable');
        if (board.owner.id !== user.id)
            return ctx.forbidden('Non autorisé');
        const { title } = ctx.request.body.data;
        const updated = await strapi.db.query('api::board.board').update({
            where: { id: Number(id) },
            data: { title },
        });
        return this.transformResponse(updated);
    },
    // supprime un tableau et tout son contenu (listes + cartes)
    async delete(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.unauthorized();
        const { id } = ctx.params;
        const board = await strapi.db.query('api::board.board').findOne({
            where: { id: Number(id) },
            populate: {
                owner: true,
                lists: {
                    populate: ['cards'],
                },
            },
        });
        if (!board)
            return ctx.notFound('Board introuvable');
        if (board.owner.id !== user.id)
            return ctx.forbidden('Non autorisé');
        // on supprime d'abord les cartes, puis les listes, puis le board
        for (const list of board.lists || []) {
            for (const card of list.cards || []) {
                await strapi.db.query('api::card.card').delete({
                    where: { id: card.id },
                });
            }
            await strapi.db.query('api::list.list').delete({
                where: { id: list.id },
            });
        }
        await strapi.db.query('api::board.board').delete({
            where: { id: Number(id) },
        });
        return { message: 'Board supprimé' };
    },
}));
