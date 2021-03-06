export default (app) => {
  app.post(
    `/tenant/:tenantId/chield-categories`,
    require('./chieldCategoriesCreate').default,
  );
  app.put(
    `/tenant/:tenantId/chield-categories/:id`,
    require('./chieldCategoriesUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/chield-categories/import`,
    require('./chieldCategoriesImport').default,
  );
  app.delete(
    `/tenant/:tenantId/chield-categories`,
    require('./chieldCategoriesDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/chield-categories/autocomplete`,
    require('./chieldCategoriesAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/chield-categories`,
    require('./chieldCategoriesList').default,
  );
  app.get(
    `/tenant/:tenantId/chield-categories/:id`,
    require('./chieldCategoriesFind').default,
  );
};
