<script context="module" lang="ts">
    // import type {Meta,StoryObj} from "@storybook/svelte";
    import TestButton from "@/components/test-button/test-button.svelte";

    // type Story=StoryObj<typeof TestButton>;

    export const meta={
        title:"test button",
        component:TestButton
    };
</script>

<script lang="ts">
    import {Story,Template} from "@storybook/addon-svelte-csf";
</script>

<Story name="huh"/>