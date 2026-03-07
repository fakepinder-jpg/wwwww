import { factories } from '@strapi/strapi';

// controlleur pour les cartes du kanban
export default factories.createCoreController('api::card.card', ({ strapi }) => ({
  async create(ctx) {
    // verifie que l'user est connecté
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Utilisateur non connecté');

    const { title, description, order, list: listId } = ctx.request.body.data;
    if (!listId) return ctx.badRequest('La liste est requise');

    // verifie que la liste apartient a l'user via le board
    const list = await strapi.db.query('api::list.list').findOne({
      where: { id: Number(listId) },
      populate: {
        board: {
          populate: ['owner'],
        },
      },
    });

    if (!list || list.board.owner.id !== user.id) {
      return ctx.forbidden('Vous ne pouvez pas ajouter une carte à cette liste');
    }

    // cree la carte dans la bdd
    const entity = await strapi.db.query('api::card.card').create({
      data: {
        title: title || 'Nouvelle carte',
        description: description || '',
        order: order || 0,
        list: Number(listId),
      },
    });

    return this.transformResponse(entity);
  },

  async update(ctx) {
    // verifie que l'user est bien connecté
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const { id } = ctx.params;
    // recupere la carte avec toute la hierachy pour verifier le propriétaire
    const card = await strapi.db.query('api::card.card').findOne({
      where: { id: Number(id) },
      populate: {
        list: {
          populate: {
            board: {
              populate: ['owner'],
            },
          },
        },
      },
    });

    if (!card || card.list.board.owner.id !== user.id) {
      return ctx.forbidden('Non autorisé');
    }

    // met a jour la carte avec les nouvelles données
    const updated = await strapi.db.query('api::card.card').update({
      where: { id: Number(id) },
      data: ctx.request.body.data,
    });

    return this.transformResponse(updated);
  },

  async delete(ctx) {
    // verifie que l'user est connecté
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const { id } = ctx.params;
    const card = await strapi.db.query('api::card.card').findOne({
      where: { id: Number(id) },
      populate: {
        list: {
          populate: {
            board: {
              populate: ['owner'],
            },
          },
        },
      },
    });

    if (!card || card.list.board.owner.id !== user.id) {
      return ctx.forbidden('Non autorisé');
    }

    // supprime la carte de la bdd
    await strapi.db.query('api::card.card').delete({
      where: { id: Number(id) },
    });

    return { message: 'Carte supprimée' };
  },
}));
