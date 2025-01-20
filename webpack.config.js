const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Voeg polyfills toe voor Node.js-modules
  config.resolve.fallback = {
    fs: false,
    net: false,
    tls: false,
    dgram: false,
    dns: false,
    http2: false,
    child_process: false,
    module: false,
  };

  return config;
};
