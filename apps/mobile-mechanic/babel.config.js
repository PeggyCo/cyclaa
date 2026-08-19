module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts'],
          alias: {
            '@': './src',
            '@screens': './src/screens',
            '@components': './src/components',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@api': './src/api',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@hooks': './src/hooks',
            '@types': './src/types',
            '@shared': '../../packages/shared/src',
          },
        },
      ],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      'react-native-reanimated/plugin',
    ],
  };
};
