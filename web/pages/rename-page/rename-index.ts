import {mount} from "svelte";
import RenameIndex from "./rename-index.svelte";

function main():void
{
    mount(RenameIndex,{target:document.body});
}

window.onload=main;