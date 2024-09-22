<script lang="ts">
export var imgSrc:string|undefined=undefined;
export var imgCounterNum:number=0;
export var imgCounterMax:number=0;

function h_keyControl(e:KeyboardEvent):void
{

}
</script>

<style lang="sass">
    @import "./preview-overlay.sass"
</style>

<div class="preview-overlay" on:keypress={h_keyControl}>
    <div class="img-counter">
        {imgCounterNum}/{imgCounterMax}
    </div>

    <div class="img-contain">
        <img src={imgSrc} alt="error"/>
    </div>
</div>