const { rhapsodic } = await import('@rhapsodic/eslint-config');

export default rhapsodic({
  vue: false,
  typescript: {
    parserOptions: {
      project: './tsconfig.eslint.json',
      projectService: false,
    },
  },
  stylistic: true,
});
