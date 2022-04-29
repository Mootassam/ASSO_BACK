export default (app) => {
  app.post(
    `/tenant/:tenantId/group`,
    require('./groupCreate').default,
  );
  app.put(
    `/tenant/:tenantId/group/:id`,
    require('./groupUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/group/import`,
    require('./groupImport').default,
  );
  app.delete(
    `/tenant/:tenantId/group`,
    require('./groupDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/group/autocomplete`,
    require('./groupAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/group`,
    require('./groupList').default,
  );
  app.get(
    `/tenant/:tenantId/group/:id`,
    require('./groupFind').default,
  );
};