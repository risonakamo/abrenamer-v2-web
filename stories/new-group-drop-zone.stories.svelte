<script context="module">
  import NewGroupDropZone from
    "@/components/new-group-drop-zone/new-group-drop-zone.svelte";

  export const meta={
    title:"new group drop zone",
    component:NewGroupDropZone
  };
</script>

<script>
  import {Story,Template} from "@storybook/addon-svelte-csf";
</script>

<Template let:args>
  <NewGroupDropZone {...args}/>
</Template>

<Story name="normal" args={{

}}/>

<Story name="disabled" args={{
  disabledNoItems:true
}}/>

<Story name="drag over" args={{
  draggedOver:true
}}/>