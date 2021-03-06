export default (app) => {
  app.post(
    `/tenant/:tenantId/news-tag`,
    require('./newsTagCreate').default,
  );
  app.put(
    `/tenant/:tenantId/news-tag/:id`,
    require('./newsTagUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/news-tag/import`,
    require('./newsTagImport').default,
  );
  app.delete(
    `/tenant/:tenantId/news-tag`,
    require('./newsTagDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/news-tag/autocomplete`,
    require('./newsTagAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/news-tag`,
    require('./newsTagList').default,
  );
  app.get(
    `/tenant/:tenantId/news-tag/:id`,
    require('./newsTagFind').default,
  );
};
