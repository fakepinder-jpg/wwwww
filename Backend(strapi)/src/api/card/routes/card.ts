// les routes de l'api pour les cartes
export default {
  routes: [
    {
      method: 'GET', // recupere toutes les cartes
      path: '/cards',
      handler: 'card.find',
      config: {
        auth: { scope: [] },
      },
    },
    {
      method: 'GET', // recupere une carte par son id
      path: '/cards/:id',
      handler: 'card.findOne',
      config: {
        auth: { scope: [] },
      },
    },
    {
      method: 'POST', // cree une nouvelle carte
      path: '/cards',
      handler: 'card.create',
      config: {
        auth: { scope: [] },
      },
    },
    {
      method: 'PUT', // modifie une carte existante
      path: '/cards/:id',
      handler: 'card.update',
      config: {
        auth: { scope: [] },
      },
    },
    {
      method: 'DELETE', // supprime une carte
      path: '/cards/:id',
      handler: 'card.delete',
      config: {
        auth: { scope: [] },
      },
    },
  ],
};
