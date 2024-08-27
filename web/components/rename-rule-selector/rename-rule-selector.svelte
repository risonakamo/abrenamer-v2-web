<script lang="ts">
    export var titleText:string="";
    export var itemCountText:string="";
    export var itemCount:number=0;
</script>

<style lang="sass">
    @import "./rename-rule-selector.sass"
</style>

<div class="rename-rule-selector">
    <h2 class="title">{titleText}</h2>
    <div class="container">
        <p>Rule</p>
        <input type="text"/>

        <p>Template</p>
        <select>
            <option>Increment Number</option>
            <option>Random Hash</option>
        </select>
    </div>
    <div class="item-count">
        <h3>{itemCountText}: {itemCount}</h3>
    </div>
</div>