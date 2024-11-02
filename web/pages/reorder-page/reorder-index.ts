import {mount} from "svelte";
import ReorderIndex from "./reorder-index.svelte";

function main():void
{
    mount(ReorderIndex,{target:document.body});
}

window.onload=main;