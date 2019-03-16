// Function to create a data tree from a adjacent list
// given array must have 'parent_id' and 'id' that correlates to each other
// parent elements must have id = 0;
let unflatten = function(array, parent = { id: 0 }, tree = []) {
    let children = array.filter(child => {
        return child.parent_id == parent.id;
    });

    if (!_.isEmpty(children)) {
        if (parent.id == 0) {
            tree = children;
        } else {
            parent["children"] = children;
        }

        children.forEach(child => {
            unflatten(array, child);
        });
    }

    return tree;
};

export default unflatten;
