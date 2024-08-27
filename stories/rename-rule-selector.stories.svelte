<script context="module">
import RenameRuleSelector from "@/components/rename-rule-selector/rename-rule-selector.svelte";

export const meta={
    title:"rename selector",
    component:RenameRuleSelector
};
</script>

<script>
import {Story,Template} from "@storybook/addon-svelte-csf";
</script>

<Template let:args>
    <RenameRuleSelector {...args}/>
</Template>

<Story name="normal" args={{
    titleText:"Groups Rename Rule",
    itemCountText:"Groups",
    itemCount:3,
}}/>

<Story name="normal2" args={{
    titleText:"Items Rename Rule",
    itemCountText:"Items",
    itemCount:10,
}}/>