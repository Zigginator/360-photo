import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';

const config: StorybookConfig = {
  stories: ['../stories-vue/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  async viteFinal(config) {
    // Ensure Vue plugin is configured
    config.plugins = config.plugins || [];
    if (!config.plugins.some((plugin: any) => plugin?.name === 'vite:vue')) {
      config.plugins.push(vue());
    }
    
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = config.optimizeDeps.include || [];
    config.optimizeDeps.include.push('@storybook/blocks', 'preact', 'vue');
    
    return config;
  },
};

export default config;
