<script context="module">
  import ImageTile from "@/components/image-tile/image-tile.svelte";

  export const meta={
    title:"image tile",
    component:ImageTile
  };
</script>

<script>
  import {Story} from "@storybook/addon-svelte-csf";

  import Wide1 from "@/assets/wide1.jpeg";
  import Tall1 from "@/assets/tall1.png";
  import Sqaure1 from "@/assets/square1.png";
</script>

<Story name="wide">
  <ImageTile imgSrc={Wide1} fileName="wide1.jpeg"/>
</Story>

<Story name="tall">
  <ImageTile imgSrc={Tall1} fileName="tall1.png"/>
</Story>

<Story name="square">
  <ImageTile imgSrc={Sqaure1} fileName="square1.png"/>
</Story>

<Story name="non image">
  <ImageTile fileName="something.txt" fileType="txt"/>
</Story>

<Story name="wide selected">
  <ImageTile imgSrc={Wide1} fileName="wide1.jpeg" selected selectedCount={3}/>
</Story>

<Story name="non image selected">
  <ImageTile fileName="something.txt" fileType="txt" selected selectedCount={1}/>
</Story>