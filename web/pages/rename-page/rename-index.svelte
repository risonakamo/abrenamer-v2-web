<script lang="ts">
import {onMount} from "svelte";
import _ from "lodash";

import Button1 from "@/components/button1/button1.svelte";
import RenameRuleSelector from
    "@/components/rename-rule-selector/rename-rule-selector.svelte";
import {getItemsData,getDefaultOutputDir,doRename,
    clearItemsData} from "@/api/bridge-api";
import {fileGroupToGroupedPaths} from "@/lib/file-group";

// load items data, set output dir to default output dir
onMount(async ()=>{
    itemsdata=await getItemsData();

    outputDirText=await getDefaultOutputDir();
});

// currently selected output dir
var outputDirText:string=$state("");

var itemsdata:ItemsData=$state({
    fileItemsData:{},
    fileGroups:[],
});

var groupRenameRule:string=$state("{{inc}}");
var itemsRenameRule:string=$state("{{inc}}");

// the last rename request status recved
var lastRenameRequestStatus:RenameRequestStatus|undefined=$state(undefined);

// while succesful rename active, rename page is disabled with only a button
// to clear and go back to reorder page
var successfulRename:boolean=$derived.by(()=>{
    if (lastRenameRequestStatus)
    {
        return lastRenameRequestStatus.status=="success";
    }

    return false;
});

/** when enabled, controls to perform renaming are hidden. enabled after recved
 *  status about a successful rename */
var controlsHidden:boolean=$derived(successfulRename);

/** helper to make and send rename request using all the current information */
async function sendRenameRequest(mode:RenameMode):Promise<void>
{
    const renameRequest:RenameRequest={
        items:fileGroupToGroupedPaths($state.snapshot(itemsdata).fileGroups),
        groupRenameRule:groupRenameRule,
        itemRenameRule:itemsRenameRule,
        outputDir:outputDirText,
        renameMode:mode,
    };

    lastRenameRequestStatus=await doRename(renameRequest);
}

/** back button, return to reorder page.
 *  if in rename success state, send request to clear items */
async function h_backButton():Promise<void>
{
    if (successfulRename)
    {
        await clearItemsData();
    }

    window.location.href="reorder-page.html";
}

/** clicked copy button. send the rename request */
function h_copyButton():void
{
    sendRenameRequest("copy");
}

/** clicked move button. send rename request for move */
function h_moveButton():void
{
    sendRenameRequest("move");
}

</script>

<style lang="sass">
    @use "./rename-index.sass"
</style>

<main>
    <div class="message-zone"
        class:hidden={!lastRenameRequestStatus}
        class:error={lastRenameRequestStatus?.status=="error"}
        class:success={lastRenameRequestStatus?.status=="success"}
    >
        <p>{lastRenameRequestStatus?.description || ""}</p>
    </div>

    <div class="controls" class:hidden={controlsHidden}>
        <div class="submit-zone">
            <div class="contain">
                <p class="input-box-label">Output Location</p>
                <input type="text" class="themed-input-box" bind:value={outputDirText}/>
                <div class="button-contain">
                    <div class="inner-contain">
                        <Button1 text="Move" onclick={h_moveButton}/>
                    </div>
                    <div class="inner-contain">
                        <Button1 text="Copy" onclick={h_copyButton}/>
                    </div>
                </div>
            </div>
        </div>

        <div class="rename-rules">
            <div class="rule-contain">
                <RenameRuleSelector titleText="Groups Rename Rule" itemCountText="Groups"
                    itemCount={itemsdata.fileGroups.length}
                    bind:ruleInputBoxText={groupRenameRule}/>
            </div>
            <div class="rule-contain">
                <RenameRuleSelector titleText="Items Rename Rule" itemCountText="Items"
                    itemCount={_.size(itemsdata.fileItemsData)}
                    bind:ruleInputBoxText={itemsRenameRule}/>
            </div>
        </div>
    </div>

    <div class="bottom-zone">
        <Button1 text="Back to Reorder" onclick={h_backButton}/>
    </div>
</main>