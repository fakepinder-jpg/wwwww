"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// controlleur pour les listes du kanban
exports.default = strapi_1.factories.createCoreController('api::list.list', ({ strapi }) => ({
    async create(ctx) {
        // verifie que l'utilisateur est connecté
        const user = ctx.state.user;
        if (!user)
            return ctx.unauthorized('Utilisateur non connecté');
        const { title, order, board: boardId } = ctx.request.body.data;
        if (!boardId)
            return ctx.badRequest('Le board est requis');
        // on verifie que le board apartient bien a l'user
        const board = await strapi.db.query('api::board.board').findOne({
            where: { id: Number(boardId) },
            populate: ['owner'],
        });
        if (!board || board.owner.id !== user.id) {
            return ctx.forbidden('Vous ne pouvez pas ajouter une liste à ce board');
        }
        // cree la liste dans la base de donnée
        const entity = await strapi.db.query('api::list.list').create({
            data: {
                title: title || 'Nouvelle liste',
                order: order || 0,
                board: Number(boardId),
            },
        });
        return this.transformResponse(entity);
    },
    async update(ctx) {
        // verifie que l'user est connecté
        const user = ctx.state.user;
        if (!user)
            return ctx.unauthorized();
        const { id } = ctx.params;
        // recupere la liste avec son board et son proprietaire
        const list = await strapi.db.query('api::list.list').findOne({
            where: { id: Number(id) },
            populate: {
                board: {
                    populate: ['owner'],
                },
            },
        });
        if (!list || list.board.owner.id !== user.id) {
            return ctx.forbidden('Non autorisé');
        }
        // met a jour la liste
        const updated = await strapi.db.query('api::list.list').update({
            where: { id: Number(id) },
            data: ctx.request.body.data,
        });
        return this.transformResponse(updated);
    },
    async delete(ctx) {
        // verifie que l'user est connecté
        const user = ctx.state.user;
        if (!user)
            return ctx.unauthorized();
        const { id } = ctx.params;
        const list = await strapi.db.query('api::list.list').findOne({
            where: { id: Number(id) },
            populate: {
                board: {
                    populate: ['owner'],
                },
                cards: true,
            },
        });
        if (!list || list.board.owner.id !== user.id) {
            return ctx.forbidden('Non autorisé');
        }
        // supprime toutes les cartes de la liste avant de supprimer la liste
        for (const card of list.cards || []) {
            await strapi.db.query('api::card.card').delete({
                where: { id: card.id },
            });
        }
        await strapi.db.query('api::list.list').delete({
            where: { id: Number(id) },
        });
        return { message: 'Liste supprimée' };
    },
}));
