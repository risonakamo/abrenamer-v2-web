<script lang="ts">
    export var text:string="";
</script>

<style lang="sass">
    @use "./button1.sass"
</style>

<div class="button1" on:click>
    <p>{text}</p>
</div>