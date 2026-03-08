"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    register() { },
    async bootstrap({ strapi }) {
        await activerPermissions(strapi);
    },
};
// Active automatiquement les permissions d'inscription et de connexion
// pour le role Public au premier demarrage (evite de le faire manuellement dans l'admin)
async function activerPermissions(strapi) {
    const permissionsParRole = {
        public: [
            'plugin::users-permissions.auth.callback',
            'plugin::users-permissions.auth.register',
        ],
        authenticated: [
            'api::board.board.create',
            'api::board.board.find',
            'api::board.board.findone',
            'api::board.board.findOne',
            'api::board.board.update',
            'api::board.board.delete',
            'api::list.list.create',
            'api::list.list.find',
            'api::list.list.findone',
            'api::list.list.findOne',
            'api::list.list.update',
            'api::list.list.delete',
            'api::card.card.create',
            'api::card.card.find',
            'api::card.card.findone',
            'api::card.card.findOne',
            'api::card.card.update',
            'api::card.card.delete',
            'api::label.label.create',
            'api::label.label.find',
            'api::label.label.findone',
            'api::label.label.findOne',
            'api::label.label.update',
            'api::label.label.delete',
        ],
    };
    for (const [type, actions] of Object.entries(permissionsParRole)) {
        const role = await strapi.db
            .query('plugin::users-permissions.role')
            .findOne({ where: { type } });
        if (!role) {
            console.warn(`[permissions] Role "${type}" introuvable, skip.`);
            continue;
        }
        // Recupere toutes les permissions existantes pour ce role en une seule requete
        const existingPerms = await strapi.db
            .query('plugin::users-permissions.permission')
            .findMany({ where: { role: role.id } });
        const permMap = {};
        for (const p of existingPerms) {
            permMap[p.action] = p;
        }
        for (const action of actions) {
            const existing = permMap[action];
            if (existing) {
                if (!existing.enabled) {
                    await strapi.db
                        .query('plugin::users-permissions.permission')
                        .update({ where: { id: existing.id }, data: { enabled: true } });
                    console.log(`[permissions] Activé: ${action}`);
                }
            }
            else {
                await strapi.db
                    .query('plugin::users-permissions.permission')
                    .create({ data: { action, enabled: true, role: role.id } });
                console.log(`[permissions] Créé: ${action}`);
            }
        }
    }
}
