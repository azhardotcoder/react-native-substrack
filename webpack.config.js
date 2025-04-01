const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Customize the config before returning it.
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': './src',
    '@/components': './components',
    '@/lib': './lib',
    '@/context': './context'
  };

  // Add expo-router configuration
  config.resolve.alias['expo-router'] = require.resolve('expo-router');
  config.resolve.alias['expo-router/entry'] = require.resolve('expo-router/entry');

  return config;
}; 