export default {
  register() {},

  async bootstrap({ strapi }) {
    await activerPermissions(strapi);
  },
};

// Active automatiquement les permissions d'inscription et de connexion
// pour le role Public au premier demarrage (evite de le faire manuellement dans l'admin)
async function activerPermissions(strapi: any) {
  const permissionsParRole: Record<string, string[]> = {
    public: [
      'plugin::users-permissions.auth.callback',
      'plugin::users-permissions.auth.register',
    ],
    authenticated: [
      'api::board.board.create',
      'api::board.board.find',
      'api::board.board.findone',
      'api::board.board.update',
      'api::board.board.delete',
      'api::list.list.create',
      'api::list.list.find',
      'api::list.list.findone',
      'api::list.list.update',
      'api::list.list.delete',
      'api::card.card.create',
      'api::card.card.find',
      'api::card.card.findone',
      'api::card.card.update',
      'api::card.card.delete',
      'api::label.label.create',
      'api::label.label.find',
      'api::label.label.findone',
      'api::label.label.update',
      'api::label.label.delete',
    ],
  };

  for (const [type, actions] of Object.entries(permissionsParRole)) {
    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type } });

    if (!role) continue;

    for (const action of actions) {
      const permission = await strapi.db
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: role.id } });

      if (permission) {
        if (!permission.enabled) {
          await strapi.db
            .query('plugin::users-permissions.permission')
            .update({ where: { id: permission.id }, data: { enabled: true } });
        }
      } else {
        await strapi.db
          .query('plugin::users-permissions.permission')
          .create({ data: { action, enabled: true, role: role.id } });
      }
    }
  }
}
