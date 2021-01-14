module.exports = function babelConfig(api) {
  api.cache(true);

  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
    'next/babel',
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
  ];

  const plugins = [
    [
      'babel-plugin-styled-components',
      { ssr: true, displayName: true, preprocess: false },
    ],
    '@babel/plugin-transform-runtime',
  ];

  return {
    presets,
    plugins,
  };
};
