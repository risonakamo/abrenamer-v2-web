// funcs to work file FileItemGroup lists

import _ from "lodash";

/** places all target items after the drop item, in the
 *  order it was specified in move items. removes all other instances of move items
 *  from all groups. if any move item did not exist, doesn't care, so watch out
 *  for this.
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
    dropItem:string
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
    // if fail to find, then will just have to insert at the front of the group
    if (moveItemsSet.has(dropItem))
    {
        actualDropItem=undefined;

        for (let itemI=0;itemI<dropItemGroup.items.length;itemI++)
        {
            const item:string=dropItemGroup.items[itemI];

            // the item is the drop item, quit search
            if (item==dropItem)
            {
                continue;
            }

            // the item is an item that is not one of the move items. set it as
            // a potential actual drop item, but need to keep going until find the
            // drop item
            if (!moveItemsSet.has(item))
            {
                actualDropItem=item;
            }
        }
    }

    // from all groups, purge all the target move items
    const newGroups:FileItemGroup[]=_.map(groups,(group:FileItemGroup):FileItemGroup=>{
        return {
            name:group.name,
            // reject items that are in the move items set
            items:_.reject(group.items,(item:string):boolean=>{
                return moveItemsSet.has(item);
            })
        };
    });

    // target the drop group (found the index of earlier)
    const newDropGroup:FileItemGroup=newGroups[dropItemGroupI];

    // find index to drop items after by looking for the actual drop item again.
    // if the actual drop item was null (because there was no valid items before the
    // drop item), then it stays defaulted at 0.
    var actualDropIndex:number=0;
    if (actualDropItem)
    {
        actualDropIndex=_.findIndex(newDropGroup.items,(item:string):boolean=>{
            return item==actualDropItem;
        });
    }

    // strange situation, failed to find the actual drop item.
    if (actualDropIndex<0)
    {
        console.error("failed to find actual drop item after purging");
        return groups;
    }

    newDropGroup.items.splice(actualDropIndex+1,0,...moveItems);

    return newGroups;
}