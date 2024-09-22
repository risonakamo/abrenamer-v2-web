<script lang="ts">
import {createEventDispatcher,onMount} from "svelte";

import {findNextItem} from "@/lib/file-group";

const dispatch=createEventDispatcher<{
    /** requesting to close overlay */
    close:void
}>();

/** immediately focus on spawn */
onMount(()=>{
    ref.focus();
});

/** the file groups states from parent */
export var fileGroups:FileItemGroup[]=[];

/** 2WAY. the current image showing in the overlay */
export var currentImg:string|undefined=undefined;

var imgCounterGroupCurrent:number=0;
var imgCounterGroupMax:number=0;
var imgCounterAllCurrent:number=0;
var imgCounterAllMax:number=0;

/** element ref */
var ref:HTMLDivElement;

/** navigate the current image */
function itemNavigate(offset:number):void
{
    if (!currentImg)
    {
        return;
    }

    currentImg=findNextItem(
        fileGroups,
        currentImg,
        offset,
    );
}

/** overlay key controls */
function h_keyControl(e:KeyboardEvent):void
{
    const key:string=e.key.toLowerCase();

    // neutral control layer
    if (!e.ctrlKey && !e.shiftKey && !e.altKey)
    {
        switch (key)
        {
            case "d":
            case "arrowright":
            itemNavigate(1);
            break;

            case "a":
            case "arrowleft":
            itemNavigate(-1);
            break;

            case "escape":
            dispatch("close");
            break;
        }
    }
}
</script>

<style lang="sass">
    @import "./preview-overlay.sass"
</style>

<div class="preview-overlay" on:keydown={h_keyControl} tabindex="0" bind:this={ref}>
    <div class="img-counter">
        {imgCounterGroupCurrent}/{imgCounterGroupMax}
    </div>

    <div class="img-contain">
        <img src={currentImg} alt="error"/>
    </div>
</div>