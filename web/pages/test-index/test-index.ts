import TestIndex from "./TestIndex.svelte";

function main():void
{
    new TestIndex({
        target:document.body
    });
}

window.onload=main;