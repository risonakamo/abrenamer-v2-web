<script lang="ts">
export var imgSrc:string|undefined=undefined;
export var imgCounterNum:number=0;
export var imgCounterMax:number=0;
</script>

<style lang="sass">
    @import "./preview-overlay.sass"
</style>

<div class="preview-overlay">
    <div class="img-counter">
        {imgCounterNum}/{imgCounterMax}
    </div>

    <div class="img-contain">
        <img src={imgSrc} alt="error"/>
    </div>
</div>