<script lang="ts">
import Button1 from "@/components/button1/button1.svelte";
import RenameRuleSelector from
    "@/components/rename-rule-selector/rename-rule-selector.svelte";


</script>

<style lang="sass">
    @import "./rename-index.sass"
</style>

<main>
    <div class="submit-zone">
        <div class="contain">
            <p class="input-box-label">Output Location</p>
            <input type="text" class="themed-input-box"/>
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
            <RenameRuleSelector titleText="Groups Rename Rule" itemCountText="Groups"/>
        </div>
        <div class="rule-contain">
            <RenameRuleSelector titleText="Items Rename Rule" itemCountText="Items"/>
        </div>
    </div>

    <div class="bottom-zone">
        <Button1 text="Cancel"/>
    </div>
</main>