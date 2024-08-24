<script context="module">
import Button1 from "@/components/button1/button1.svelte";

export const meta={
    title:"button1",
    component:Button1
};
</script>

<script>
import {Story,Template} from "@storybook/addon-svelte-csf";
</script>

<Template let:args>
    <Button1 {...args}/>
</Template>

<Story name="normal" args={{

}}/>