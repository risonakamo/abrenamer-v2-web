<script lang="ts">
    var dragCounter:number=0;

    /** drag item into zone. increment counter */
    function h_dragEnter():void
    {
        dragCounter++;
    }

    /** drag exited zone. decrement counter */
    function h_dragOut():void
    {
        dragCounter--;
    }

    /** drag finished anywhere. end counter */
    function h_dragEnd():void
    {
        dragCounter=0;
    }

    var draggedOver:boolean=false;
    $: draggedOver=dragCounter>0;
</script>

<style lang="sass">
    @import "./initial-drop-zone.sass"
</style>

<div class="initial-drop-zone" on:dragenter={h_dragEnter} on:dragleave={h_dragOut}
    class:dropping={draggedOver} on:dragend={h_dragEnd} on:drop|stopPropagation|preventDefault
    on:dragover|preventDefault
>
    + Drop Items To Add
</div>