<script context="module">
  import ImageTile from "@/components/image-tile/image-tile.svelte";
  import Wide1 from "@/assets/wide1.jpeg";
  import Tall1 from "@/assets/tall1.png";
  import Sqaure1 from "@/assets/square1.png";

  export const meta={
    title:"image tile",
    component:ImageTile
  };
</script>

<script>
  import {Story,Template} from "@storybook/addon-svelte-csf";
</script>

<Story name="wide">
  <ImageTile imgSrc={Wide1}/>
</Story>

<Story name="tall">
  <ImageTile imgSrc={Tall1}/>
</Story>

<Story name="square">
  <ImageTile imgSrc={Sqaure1}/>
</Story>