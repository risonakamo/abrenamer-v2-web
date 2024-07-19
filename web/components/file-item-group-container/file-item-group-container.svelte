<script lang="ts">
  export var title:string="";
  export var numItems:number=0;
</script>

<style lang="sass">
  @import "./file-item-group-container.sass"
</style>

<div class="file-item-group-container">
  <h2>{title} ({numItems})</h2>
  <div class="contents">
    <slot/>
  </div>
</div>