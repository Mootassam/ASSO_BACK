const models = [
  require('./tenant').default,
  require('./auditLog').default,
  require('./settings').default,
  require('./user').default,
  require('./election').default,
  require('./association').default,
  require('./newsCategory').default,
  require('./newsTag').default,
  require('./news').default,
  require('./partner').default,
  require('./group').default,
  require('./formule').default,
  require('./membership').default,
  require('./campaign').default,
  require('./objectif').default,
  require('./entree').default,
  require('./depense').default,
  require('./charge').default,
];

export default function init(database) {
  for (let model of models) {
    model(database);
  }

  return database;
}

export async function createCollections(database) {
  for (let model of models) {
    await model(database).createCollection();
  }

  return database;
}
