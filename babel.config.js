module.exports = {
  compact: true,
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/react',
    '@babel/typescript',
  ],
  plugins: [
    '@babel/proposal-object-rest-spread',
    '@babel/proposal-class-properties',
    '@babel/proposal-optional-chaining',
    '@babel/syntax-dynamic-import',
    '@babel/transform-modules-commonjs',
    '@babel/plugin-transform-runtime',
    'macros',
  ],
  env: {
    test: {
      plugins: [
        '@babel/transform-modules-commonjs',
        '@babel/syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
      ],
    },
    tooling: {
      presets: [
        [
          '@babel/env',
          {
            modules: 'commonjs',
          },
        ],
        '@babel/typescript',
      ],
    },
  },
};
