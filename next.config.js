const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        mongodb_username: 'chike',
        mongodb_password: 'zg3sDqHsQLDNX0wD',
        mongodb_clustername: 'cluster0',
        mongodb_database: 'auth-demo',
      },
    };
  }

  return {
    env: {
      mongodb_username: 'chike',
      mongodb_password: 'zg3sDqHsQLDNX0wD',
      mongodb_clustername: 'cluster0',
      mongodb_database: 'auth-demo_prod',
    },
  };
};
