<script context="module">
  import ImageTile from "@/components/image-tile/image-tile.svelte";

  export const meta={
    title:"image tile",
    component:ImageTile
  };
</script>

<script>
  import {Story,Template} from "@storybook/addon-svelte-csf";

  import Wide1 from "@/assets/wide1.jpeg";
  import Tall1 from "@/assets/tall1.png";
  import Sqaure1 from "@/assets/square1.png";
</script>

<Template let:args>
  <ImageTile {...args}/>
</Template>

<Story name="wide" args={{
  imgSrc:Wide1,
  fileName:"wide1.jpeg"
}}/>

<Story name="tall" args={{
  imgSrc:Tall1,
  fileName:"tall1.png"
}}/>

<Story name="square" args={{
  imgSrc:Sqaure1,
  fileName:"square1.png"
}}/>

<Story name="non image" args={{
  fileType:"txt",
  fileName:"something.txt"
}}/>

<Story name="wide selected" args={{
  imgSrc:Wide1,
  fileName:"wide1.jpeg",
  selected:true,
  selectedCount:3
}}/>

<Story name="non image selected" args={{
  fileName:"something.mp4",
  fileType:"mp4",
  selected:true,
  selectedCount:10
}}/>