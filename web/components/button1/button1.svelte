<script lang="ts">
var {
    text="",
    onclick
}:{
    text:string
    onclick?():void
}=$props();
</script>

<style lang="sass">
    @use "./button1.sass"
</style>

<div class="button1" onclick={onclick}>
    <p>{text}</p>
</div>