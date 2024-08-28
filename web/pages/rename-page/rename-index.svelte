<script lang="ts">
import Button1 from "@/components/button1/button1.svelte";
import RenameRuleSelector from
    "@/components/rename-rule-selector/rename-rule-selector.svelte";


</script>

<style lang="sass">
    @import "./rename-index.sass"
</style>

<main>
    <div class="top-zone">

    </div>

    <div class="rename-rules">
        <div class="rule-contain">
            <RenameRuleSelector/>
        </div>
        <div class="rule-contain">
            <RenameRuleSelector/>
        </div>
    </div>

    <div class="submit-zone">
        <div class="contain">
            <input type="text" class="themed-input-box"/>
            <div class="button-contain">
                <Button1 text="Move"/>
                <Button1 text="Rename"/>
            </div>
        </div>
    </div>
</main>