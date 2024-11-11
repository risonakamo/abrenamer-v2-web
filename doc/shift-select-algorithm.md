# description plan
- shift select algorithm takes 2 arrays:
    - array of all items
    - array of all selected items, in order
- its job is to remove a range of items from the selected items list (deselection) or remove then add a range of items to the **end** of the selected items list
    - shift select should always append to the end of the list
    - selected items had no ordering, then it would just add to the selected items set without caring about ordering. but with ordering, it should always add to the end
- whether or not to select or deselect is based on the status of the 1st item. if the 1st item is not currently selected, then the operation is a deselect operation, otherwise it is the reverse
- returns the new list of selected items
- if 1st item appears after last item, then the operation should occur backwards
    - items should be added to the selection list in reverse order, **but still to the end of the selection array**

# steps
- flatten the groups array into simple list of item paths
- check if 1st item and last item exist in list of items
- determine if deselecting or selecting by checking if the firstItem is selected or not
- determine if doing reverse or forward selection by checking if 1st item comes before last item or not
    - if reverse, flip the entire flattened groups array
- create list of items to interact with using the 1st and last item
- remove all the listed items from the selected items array (immutably)
- if deselect mode, done
- if select mode, add back all the items to end of selected items array