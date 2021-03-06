export default (app) => {
  app.post(
    `/tenant/:tenantId/attribute-options`,
    require('./attributeOptionsCreate').default,
  );
  app.put(
    `/tenant/:tenantId/attribute-options/:id`,
    require('./attributeOptionsUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/attribute-options/import`,
    require('./attributeOptionsImport').default,
  );
  app.delete(
    `/tenant/:tenantId/attribute-options`,
    require('./attributeOptionsDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/attribute-options/autocomplete`,
    require('./attributeOptionsAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/attribute-options`,
    require('./attributeOptionsList').default,
  );
  app.get(
    `/tenant/:tenantId/attribute-options/:id`,
    require('./attributeOptionsFind').default,
  );
};
