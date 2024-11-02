<script lang="ts">
import {onMount} from "svelte";

import Button1 from "@/components/button1/button1.svelte";
import RenameRuleSelector from
    "@/components/rename-rule-selector/rename-rule-selector.svelte";
import {getItemsData,getDefaultOutputDir} from "@/api/bridge-api";
import _ from "lodash";

// currently selected output dir
var outputDirText:string="";

var itemsdata:ItemsData={
    fileItemsData:{},
    fileGroups:[],
};

// load items data, set output dir to default output dir
onMount(async ()=>{
    itemsdata=await getItemsData();

    outputDirText=await getDefaultOutputDir();
});

/** back button, return to reorder page */
function h_backButton():void
{
    window.location.href="reorder-page.html";
}

</script>

<style lang="sass">
    @use "./rename-index.sass"
</style>

<main>
    <div class="submit-zone">
        <div class="contain">
            <p class="input-box-label">Output Location</p>
            <input type="text" class="themed-input-box" bind:value={outputDirText}/>
            <div class="button-contain">
                <div class="inner-contain">
                    <Button1 text="Move"/>
                </div>
                <div class="inner-contain">
                    <Button1 text="Rename"/>
                </div>
            </div>
        </div>
    </div>

    <div class="rename-rules">
        <div class="rule-contain">
            <RenameRuleSelector titleText="Groups Rename Rule" itemCountText="Groups"
                itemCount={itemsdata.fileGroups.length}/>
        </div>
        <div class="rule-contain">
            <RenameRuleSelector titleText="Items Rename Rule" itemCountText="Items"
                itemCount={_.size(itemsdata.fileItemsData)}/>
        </div>
    </div>

    <div class="bottom-zone">
        <Button1 text="Cancel" on:click={h_backButton}/>
    </div>
</main>