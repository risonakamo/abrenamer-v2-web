<script lang="ts">
import {findRule, PremadeRules} from "@/lib/premade-rules";


// --- props
var {
    // title of the renamer rule box
    titleText="",
    // text to display next to the item count
    itemCountText="",
    // the item count value
    itemCount=0,
    // value of the rule input box
    ruleInputBoxText=$bindable("{{inc}}"),
}:{
    titleText:string
    itemCountText:string
    itemCount:number
    ruleInputBoxText:string
}=$props();



// --- state
// rule index that is currently selected. set to -1 for "custom rule"
var selectedRuleI:number=$state(0);

// actual selected rule obj
var selectedRule:PremadeRenameRule=$derived(PremadeRules[selectedRuleI]);



// --- handlers
/** user typed into the rule input. check if the input matches one of the premade rules.
 *  if it does, select the corresponding rule */
function h_ruleInputChange():void
{
    const foundRule:number|null=findRule(ruleInputBoxText);

    selectedRuleI=foundRule;
}

/** user changed the selected rule. set the input box to the corresponding selected rule
 *  text */
function h_selectedRule():void
{
    ruleInputBoxText=PremadeRules[selectedRuleI].ruleString;
}
</script>

<style lang="sass">
    @use "./rename-rule-selector.sass"
</style>

<div class="rename-rule-selector">
    <h2 class="title">{titleText}</h2>
    <div class="container">
        <p class="input-box-label">Rule</p>
        <input type="text" class="themed-input-box" bind:value={ruleInputBoxText}
            onchange={h_ruleInputChange}/>

        <p class="input-box-label">Template</p>
        <select class="themed-selector-box" bind:value={selectedRuleI}
            onchange={h_selectedRule}
        >
            <option disabled hidden value={-1}>Custom Rule</option>
            {#each PremadeRules as rule,ruleI}
                <option value={ruleI}>{rule.displayText}</option>
            {/each}
        </select>
    </div>
    <div class="item-count">
        <h3>{itemCountText}: {itemCount}</h3>
    </div>
</div>