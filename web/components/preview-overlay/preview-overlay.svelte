<script lang="ts">
import {createEventDispatcher,onMount} from "svelte";

import {findItemPosition, findNextItem} from "@/lib/file-group";

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

/** counter indicator states */
var imgCounterGroupCurrent:number=0;
var imgCounterGroupMax:number=0;
var imgCounterAllCurrent:number=0;
var imgCounterAllMax:number=0;

// if false, tall fits instead
var imgWideFit:boolean=false;

/** self element ref */
var ref:HTMLDivElement;

/** ref to the img displaying element */
var imgRef:HTMLImageElement;

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

/** refit img on load */
function h_imgLoaded():void
{
    // wide fit occurs when window's ratio is less than img's ratio
    if (window.innerWidth/window.innerHeight<imgRef.naturalWidth/imgRef.naturalHeight)
    {
        imgWideFit=true;
    }

    else
    {
        imgWideFit=false;
    }
}

// on current image change, recalculate position values
$: {
    if (currentImg)
    {
        const filePos:FileItemPosition|null=findItemPosition(currentImg,fileGroups);

        if (!filePos)
        {
            console.error("could not get file position");

            imgCounterGroupCurrent=-1;
            imgCounterGroupMax=-1;
            imgCounterAllCurrent=-1;
            imgCounterAllMax=-1;
        }

        else
        {
            imgCounterGroupCurrent=filePos.localPosition;
            imgCounterGroupMax=filePos.totalLocalItems;
            imgCounterAllCurrent=filePos.overallPosition;
            imgCounterAllMax=filePos.totalItems;
        }
    }
}
</script>

<style lang="sass">
    @import "./preview-overlay.sass"
</style>

<div class="preview-overlay" on:keydown={h_keyControl} tabindex="0" bind:this={ref}>
    <div class="img-counter">
        <div class="big-count">
            {imgCounterAllCurrent}/{imgCounterAllMax}
        </div>
        <div class="small-count">
            {imgCounterGroupCurrent}/{imgCounterGroupMax}
        </div>
    </div>

    <div class="img-contain">
        <img src={currentImg} alt="error: no preview available" class:wide-fit={imgWideFit} on:load={h_imgLoaded}
            bind:this={imgRef}/>
    </div>
</div>

<svelte:window on:resize={h_imgLoaded}/>