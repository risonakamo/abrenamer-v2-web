import ReorderIndex from "./reorder-index.svelte";

function main():void
{
    new ReorderIndex({
        target:document.body
    });
}

window.onload=main;