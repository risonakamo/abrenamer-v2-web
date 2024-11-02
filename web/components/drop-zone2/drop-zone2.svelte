<script lang="ts">
import {createEventDispatcher} from "svelte";

// a generic drop zone that can be clicked on

/** slots:
 *  - active: contents when drop zone is active
 *  - disabled: contents when drop zone is disabled */

const dispatch=createEventDispatcher<{
    click:void,
    drop:DragEvent,
}>();

// set to trigger disabled state
export var disabled:boolean=false;

// used to detect dragged over state
var dragCounter:number=0;

// when true, enables dragged over visual state
var draggedOver:boolean=false;
$: {
    if (disabled)
    {
        draggedOver=false;
    }

    draggedOver=dragCounter>0;
}

/** click handler. passthrough, but disabled if disable prop is set */
function h_click():void
{
    if (disabled)
    {
        return;
    }

    dispatch("click");
}

/** passthrough drop, disabled when prop is set */
function h_drop(e:DragEvent):void
{
    if (disabled)
    {
        return;
    }

    dragCounter=0;
    dispatch("drop",e);
}

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
    @use "./drop-zone2.sass"
</style>

<div class="drop-zone2"
    class:drag-over={draggedOver && !disabled} class:disabled={disabled}
    on:click={h_click} on:drop|preventDefault={h_drop} on:dragover|preventDefault
    on:dragenter={h_dragIn} on:dragleave={h_dragOut} on:dragend={h_dragEnd}
>
    {#if !disabled}
        <slot name="active">
            i'm a zone
        </slot>
    {:else}
        <div class="disabled-wrap">
            <slot name="disabled">
                zone is disabled
            </slot>
        </div>
    {/if}
</div>