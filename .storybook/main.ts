import type {StorybookConfig} from "@storybook/svelte-vite";

const config: StorybookConfig={
    stories: [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|ts|svelte)",
        "../stories/**/*.story.@(js|ts|svelte)",
    ],
    addons: [
        "@storybook/addon-svelte-csf",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/svelte-vite",
        options: {},
    },
    // docs:{
    //     autodocs:true
    // }
};

export default config;
