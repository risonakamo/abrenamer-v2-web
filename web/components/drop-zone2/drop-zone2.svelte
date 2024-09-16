<script lang="ts">
// a generic drop zone that can be clicked on

/** slots:
 *  - active: contents when drop zone is active
 *  - disabled: contents when drop zone is disabled */

// set to trigger disabled state
export var disabled:boolean=false;

// used to detect dragged over state
var dragCounter:number=0;

// when true, enables dragged over visual state
var draggedOver:boolean=false;
$: draggedOver=dragCounter>0;

/** standard implementation for drag over tracking */
function h_dragIn():void
{
    dragCounter++;
}

/** standard implementation for drag over tracking */
function h_dragOut():void
{
    dragCounter--;
}

/** standard implementation for drag over tracking */
function h_dragEnd():void
{
    dragCounter=0;
}
</script>

<style lang="sass">
    @import "./drop-zone2.sass"
</style>

<div class="drop-zone2"
    class:drag-over={draggedOver} class:disabled={disabled}
    on:click
    on:drop|preventDefault on:dragover|preventDefault
    on:dragenter={h_dragIn} on:dragleave={h_dragOut} on:dragend={h_dragEnd}
>
    <slot name="active"/>
</div>