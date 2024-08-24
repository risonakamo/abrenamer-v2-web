import RenameIndex from "./rename-index.svelte";

function main():void
{
    new RenameIndex({
        target:document.body
    });
}

window.onload=main;