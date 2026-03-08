// politique de securite: verifie que l'user est bien le proprietaire de la ressource
export default async (policyContext, config, { strapi }) => {
  const user = policyContext.state.user;

  // si pas connecte on refuse direct
  if (!user) {
    return false;
  }

  const { id } = policyContext.params;

  // si pas d'id dans l'url (ex: liste de tous les boards) on laisse passer
  if (!id) {
    return true;
  }

  try {
    // on recupere la ressource avec son owner
    const entity = await strapi.entityService.findOne(
      policyContext.state.route.info.apiName,
      id,
      { populate: ['owner'] }
    );

    // ressource introuvable = refus
    if (!entity) {
      return false;
    }

    // on compare l'owner de la ressource avec l'user connecte
    return entity.owner && entity.owner.id === user.id;
  } catch (error) {
    return false;
  }
};
