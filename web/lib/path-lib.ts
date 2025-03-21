// functions dealing with paths

import _ from "lodash";
import normalizePath from "normalize-path";
import {extname} from "path-browserify";

/** determine if an item path's type is in set that is considered image and thus should be
 *  rendered as a thumbnail */
export function isImage(itemPath:string):boolean
{
    const ext:string=extname(itemPath);

    switch (ext)
    {
        case ".png":
        case ".jpg":
        case ".jpeg":
        case ".gif":
        case ".webp":
        return true;
    }

    return false;
}

/** normalise all paths */
export function normalisePaths(paths:string[]):string[]
{
    return _.map(paths,(aPath:string):string=>{
        return normalizePath(aPath);
    });
}

/** convert files list from data transfer into just the full string paths */
export function filesListToPathList(filelist:FileList):string[]
{
    return _.map(filelist,(file:File):string=>{
        return normalizePath((file as ElectronFile).path);
    });
}