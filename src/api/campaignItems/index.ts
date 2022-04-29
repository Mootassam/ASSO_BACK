export default (app) => {
  app.post(
    `/tenant/:tenantId/campaign-items`,
    require('./campaignItemsCreate').default,
  );
  app.put(
    `/tenant/:tenantId/campaign-items/:id`,
    require('./campaignItemsUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/campaign-items/import`,
    require('./campaignItemsImport').default,
  );
  app.delete(
    `/tenant/:tenantId/campaign-items`,
    require('./campaignItemsDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/campaign-items/autocomplete`,
    require('./campaignItemsAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/campaign-items`,
    require('./campaignItemsList').default,
  );
  app.get(
    `/tenant/:tenantId/campaign-items/:id`,
    require('./campaignItemsFind').default,
  );
};
