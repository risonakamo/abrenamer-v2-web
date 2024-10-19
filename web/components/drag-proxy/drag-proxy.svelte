<script lang="ts">
import {Hand} from "lucide-svelte";

export var selectedCount:number=0;

// drag is enabled only while at least 1 item is selected
var dragEnabled:boolean=false;
$: dragEnabled=selectedCount>0;
</script>

<style lang="sass">
    @import "./drag-proxy.sass"
</style>

<div class="drag-proxy" draggable={dragEnabled} class:inactive={!dragEnabled} on:dragstart>
    <p><Hand size={20}/></p>
    <p>{selectedCount}</p>
</div>