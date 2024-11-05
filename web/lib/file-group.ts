// funcs to work file FileItemGroup lists

import _ from "lodash";

/** places all target items after the drop item, in the
 *  order it was specified in move items. removes all other instances of move items
 *  from all groups. if any move item did not exist, doesn't care, so watch out
 *  for this.
 *
 *  give "before item" to place before the target item instead.
 *
 *  if the drop item is one of the move items, places all move items after the item
 *  immediately before the targetted drop item (first item before the drop item that
 *  is not one of the move items). if there are no immediate items, places it at the
 *  front of the group.
 *
 *  returns new file item group */
export function moveItemsAfter(
    groups:FileItemGroup[],
    moveItems:string[],
    dropItem:string,
    beforeItem:boolean,
):FileItemGroup[]
{
    const moveItemsSet:Set<string>=new Set(moveItems);

    // locate the group the drop item is present in
    const dropItemGroupI:number=_.findIndex(groups,(group:FileItemGroup):boolean=>{
        return _.some(group.items,(item:string):boolean=>{
            return item==dropItem;
        });
    });

    // if unable to find the drop item group, fail and do nothing
    if (dropItemGroupI<0)
    {
        console.error("unable to resolve drop item's group");
        return groups;
    }

    const dropItemGroup:FileItemGroup=groups[dropItemGroupI];

    var actualDropItem:string|undefined=dropItem;

    // the drop item is one of the move items. go through the drop item group to determine
    // the first item before the drop item that is NOT one of the move items.
    // if fail to find, then will just have to insert at the front of the group.
    // fail to find triggers immediately upon finding another selected item
    if (moveItemsSet.has(dropItem))
    {
        actualDropItem=undefined;

        for (let itemI=0;itemI<dropItemGroup.items.length;itemI++)
        {
            const item:string=dropItemGroup.items[itemI];

            // the item is an item that is not one of the move items. set it as
            // a potential actual drop item, but need to keep going until find an item
            // that is selected to get the closest one
            if (!moveItemsSet.has(item))
            {
                actualDropItem=item;
            }

            // found an item that is selected, end the search
            else
            {
                break;
            }
        }
    }

    // from all groups, purge all the target move items
    const newGroups:FileItemGroup[]=purgeItemsFromGroups(groups,moveItems);

    // target the drop group (found the index of earlier)
    const newDropGroup:FileItemGroup=newGroups[dropItemGroupI];

    // if we have an actual drop item, look for it to insert items after
    if (actualDropItem)
    {
        // find index to drop items after by looking for the actual drop item again.
        var actualDropIndex:number=_.findIndex(newDropGroup.items,(item:string):boolean=>{
            return item==actualDropItem;
        });

        // strange situation, failed to find the actual drop item.
        if (actualDropIndex<0)
        {
            console.error("failed to find actual drop item after purging");
            return groups;
        }
        // increment by 1 to place after the drop index. without increment, places before
        if (!beforeItem)
        {
            actualDropIndex+=1;
        }

        newDropGroup.items.splice(actualDropIndex,0,...moveItems);
    }

    // if we dont have a drop item, then drop at the beginning of the group
    else
    {
        newDropGroup.items.splice(0,0,...moveItems);
    }

    return newGroups;
}

/** similar to move items after, but targets a group instead of some item. can place at
 *  end of group or front */
export function moveItemsIntoGroup(
    groups:FileItemGroup[],
    moveItems:string[],
    dropGroupIndex:number,
    placement:"front"|"back",
):FileItemGroup[]
{
    // purge all the target items from groups
    const newgroups=purgeItemsFromGroups(groups,moveItems);

    // target drop group index and insert at beginning or end
    if (placement=="front")
    {
        newgroups[dropGroupIndex].items.splice(0,0,...moveItems);
    }

    else if (placement=="back")
    {
        newgroups[dropGroupIndex].items.push(...moveItems);
    }

    return newgroups;
}

/** purge list of items from a groups array */
export function purgeItemsFromGroups(
    groups:FileItemGroup[],
    items:string[],
):FileItemGroup[]
{
    const itemsSet:Set<string>=new Set(items);

    return _.map(groups,(group:FileItemGroup):FileItemGroup=>{
        return {
            name:group.name,
            // reject items that are in the move items set
            items:_.reject(group.items,(item:string):boolean=>{
                return itemsSet.has(item);
            })
        };
    });
}

/** try to find the item that is a certain offset from a target item in the filegroups.
 *  for example, offset +1 would be the item immediately after the target item.
 *  if the item is at the end or beginning, then returns the same item.
 *  returns the same item if the item was not findable in the groups list */
export function findNextItem(
    groups:FileItemGroup[],
    findItem:string,
    offset:number
):string
{
    const items:string[]=flattenGroups(groups);

    const findItemI:number=_.findIndex(items,(item:string):boolean=>{
        return item==findItem;
    });

    if (findItemI<0)
    {
        console.error("could not find target item",findItem);
        return findItem;
    }

    const offsetIndex:number=findItemI+offset;

    if (offsetIndex<0 || offsetIndex>=items.length)
    {
        return findItem;
    }

    return items[offsetIndex];
}

/** flatten file item groups into flat list of just the item paths */
function flattenGroups(groups:FileItemGroup[]):string[]
{
    return _.flatMap(groups,(group:FileItemGroup):string[]=>{
        return group.items;
    });
}

/** get positional information of a target item within a group.
 *  the position fields are +1 index. first item is 1, not 0 */
export function findItemPosition(findItem:string,groups:FileItemGroup[]):FileItemPosition|null
{
    const totalItems:number=flattenGroups(groups).length;

    // tracks how many items we have gone through. once we enounter the target item, this
    // number is the overall position of that item
    var itemCount:number=0;

    // loop through all groups and items within groups
    for (let groupI=0;groupI<groups.length;groupI++)
    {
        const group:FileItemGroup=groups[groupI];

        // tracks the position of the target item within local group
        var localItemCount:number=0;

        for (let itemI=0;itemI<group.items.length;itemI++)
        {
            itemCount++;
            localItemCount++;
            const item:string=group.items[itemI];

            if (item==findItem)
            {
                return {
                    overallPosition:itemCount,
                    localPosition:localItemCount,
                    totalItems,
                    totalLocalItems:group.items.length,
                };
            }
        }
    }

    console.error("could not find item:",findItem);
    return null;
}

/** return item groups but with all empty groups removed */
export function purgeEmptyGroups(groups:FileItemGroup[]):FileItemGroup[]
{
    return _.reject(groups,(group:FileItemGroup):boolean=>{
        return group.items.length==0;
    });
}