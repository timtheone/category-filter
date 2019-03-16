import unflatten from "./helpers/unflatten";

document.addEventListener("DOMContentLoaded", function() {
    const inputElement = document.querySelector(
        ".form-group__form__input-field"
    );
    const dataListElement = document.querySelector(".data-container__list");
    const dataListSelectionElement = document.querySelector(
        ".selection-container__list"
    );
    const applyButton = document.querySelector(
        "#data-container__list__button--apply"
    );
    const cancelButton = document.querySelector(
        "#data-container__list__button--cancel"
    );
    let tempSelectionStorage = [];

    function displayChildren(array, container) {
        let fragment = document.createDocumentFragment();
        array.forEach(element => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `<input type="checkbox" class="css-checkbox" id="checkbox${
                element.id
            }"><label for="checkbox${
                element.id
            }" class="css-label lite-x-gray"></label><i class="${
                element.icon
            }"></i>${element.name}`;
            fragment.appendChild(listItem);
        });
        container.appendChild(fragment);
    }
    // Display parent categories
    function display(data, container) {
        container.innerHTML = "";
        data.forEach((e, i) => {
            container.innerHTML += `<li class="data-container__list__parent-category"><input class="css-checkbox" id="parent__checkbox${
                e.id
            }" type="checkbox">
            <label for="parent__checkbox${
                e.id
            }" class="css-label lite-x-gray parent__checkbox"></label>
            <i class="${e.icon}"></i>
            ${e.name}
            <i class="fas fa-angle-down collapse-arrow"></i>
            <ul class="child-categories"></ul></li>`;
            let childrenContainer = document.querySelectorAll(
                ".data-container__list__parent-category ul"
            );
            displayChildren(e.children, childrenContainer[i]);
        });
        document
            .querySelectorAll(".data-container__list__parent-category")
            .forEach(e => {
                e.style.maxHeight = e.offsetHeight + "px";
            });
    }

    // Function marks/unmarks all children checkboxes if action performed on the parent checkbox
    function markCheckBox(parentCheckBox, childrenCheckBoxes) {
        if (parentCheckBox.checked == true) {
            childrenCheckBoxes.forEach(s => {
                s.childNodes[0].checked = false;
            });
        } else {
            childrenCheckBoxes.forEach(s => {
                s.childNodes[0].checked = true;
            });
        }
    }
    // Function adds marked items to the array ,that can be used later to display
    function selectCategories(element) {
        let selectedCategories = [];
        let inputCheckBoxes = element.querySelectorAll("input[type=checkbox]");
        let checkedBoxes = [...inputCheckBoxes].filter(e => {
            return e.checked == true;
        });

        checkedBoxes.forEach(e => {
            if (e.parentNode.childNodes.length == 9) {
                selectedCategories.push(e.parentNode.childNodes[5].textContent);
            } else {
                selectedCategories.push(e.parentNode.childNodes[3].textContent);
            }
        });

        return selectedCategories;
    }

    function toggleControls(show = true) {
        if (show) {
            document
                .querySelector(".data-container__controls")
                .classList.remove("data-container__controls--hidden");
        } else {
            document
                .querySelector(".data-container__controls")
                .classList.add("data-container__controls--hidden");
        }
    }
    //Function displays selected categories
    function displaySelection(data, targetContainer) {
        targetContainer.innerHTML = "";
        targetContainer.parentNode.children[1].innerHTML = "";
        data.forEach(e => {
            targetContainer.innerHTML += `<span class="selection-container__list__results">${e}</span>`;
        });
        if (targetContainer.innerHTML != "") {
            targetContainer.parentNode.children[1].innerHTML += `<h4 class="selection-container__heading" >Selected categories:</h4>`;
        }
        toggleControls(false);
    }
    // Function performes cancel action, which returns previously selected state of categories
    function cancelSelection(targetContainer, element) {
        // Creating array of currently selected items
        let previouslySelectedItems = [];
        if (targetContainer.childNodes.length > 1) {
            targetContainer.childNodes.forEach(e => {
                previouslySelectedItems.push(e.innerHTML);
            });
        }

        let inputCheckBoxes = element.querySelectorAll("input[type=checkbox]");
        let inputCheckBoxesArr = [...inputCheckBoxes];
        // Looping over previously selected categories, and removing any element from all categories array if they are not in the prevously selected array
        previouslySelectedItems.forEach(s => {
            [...inputCheckBoxes].forEach(e => {
                if (
                    e.parentNode.childNodes.length == 9 &&
                    s == e.parentNode.childNodes[5].textContent
                ) {
                    e.checked = true;
                    let index = inputCheckBoxesArr.indexOf(e);
                    inputCheckBoxesArr.splice(index, 1);
                }

                if (
                    e.parentNode.childNodes.length == 4 &&
                    s == e.parentNode.childNodes[3].textContent
                ) {
                    e.checked = true;
                    let index = inputCheckBoxesArr.indexOf(e);
                    inputCheckBoxesArr.splice(index, 1);
                }
            });
        });
        // Unchecking all marks in the array that has no currently selected categories
        inputCheckBoxesArr.forEach(e => {
            e.checked = false;
        });
        toggleControls(false);
    }

    // Collapse/uncollapse subcategories
    function toggleList(parentList) {
        parentList.addEventListener("click", function(e) {
            if (e.target.className.includes("collapse-arrow")) {
                e.target.classList.toggle("show-list-arrow");
                if (e.target.className.includes("show-list-arrow")) {
                    e.target.parentNode.children[4].classList.add("hide-list");
                    e.target.parentNode.classList.add("short-list");
                } else {
                    e.target.parentNode.children[4].classList.remove(
                        "hide-list"
                    );
                    e.target.parentNode.classList.remove("short-list");
                }
            }
        });
    }

    // Fetch data from an api
    fetch("http://localhost:8000/backend/app/api/readAll.php")
        .then(resp => resp.json())
        .then(data => {
            // Create a tree structure from adjacent lists ( put subcategories in the parent categories object)
            display(unflatten(data), dataListElement);
            toggleList(dataListElement);
            // Perform search on when user types in the field
            inputElement.addEventListener("keyup", function(e) {
                let dataTree = unflatten(data);
                let searchTerm = this.value.toLowerCase();
                let restSubcategories = [];
                let savedCategoryIds = [];
                let parentResults = [];
                let result = [];

                // Search for Parent Categories
                let parentCategories = dataTree.filter(e => {
                    return e.name.toLowerCase().startsWith(searchTerm) == true;
                });

                // Search for Subcategories
                dataTree.forEach(e => {
                    let childCategories = e.children.filter(child => {
                        if (searchTerm.length <= 1) {
                            return (
                                child.name
                                    .toLowerCase()
                                    .startsWith(searchTerm) == true
                            );
                        }
                        // Use includes method if search string is bigger that 1 character
                        // I find it more intuitive to have an ability to get results if search string
                        // is in the middle of the haystack string.
                        return (
                            child.name.toLowerCase().includes(searchTerm) ==
                            true
                        );
                    });

                    let childCategoriesRest = e.children.filter(child => {
                        if (searchTerm.length <= 1) {
                            return (
                                child.name
                                    .toLowerCase()
                                    .startsWith(searchTerm) == false
                            );
                        }

                        return (
                            child.name.toLowerCase().includes(searchTerm) ==
                            false
                        );
                    });

                    if (!_.isEmpty(childCategories)) {
                        // Add all matched categories to an array
                        childCategories.forEach(childRes => {
                            savedCategoryIds.push(childRes.parent_id);
                        });
                        // Save the rest subcategories too
                        childCategoriesRest.forEach(e => {
                            restSubcategories.push(e);
                        });
                    }
                });

                // Get distict parent id only once
                let uniqueSavedCategoryIds = [...new Set(savedCategoryIds)];

                uniqueSavedCategoryIds.forEach(element => {
                    let parentResult = dataTree.filter(e => {
                        return e.id == element;
                    });
                    parentResults.push(parentResult[0]);
                });

                parentResults.forEach(e => {
                    _.pullAllBy(e.children, restSubcategories, "id");
                });

                if (searchTerm == "") {
                    result = parentCategories;
                } else {
                    result = parentResults.concat(parentCategories);
                }
                // Display search results.
                display(result, dataListElement);
            });

            dataListElement.addEventListener("click", function(e) {
                if (e.target.className.includes("parent__checkbox")) {
                    let innerListItems =
                        e.target.parentNode.childNodes[8].childNodes;
                    markCheckBox(
                        e.target.parentNode.children[0],
                        innerListItems
                    );
                }
                if (e.target.tagName == "INPUT") {
                    tempSelectionStorage = selectCategories(dataListElement);
                    toggleControls();
                }
            });

            applyButton.addEventListener("click", function() {
                displaySelection(
                    tempSelectionStorage,
                    dataListSelectionElement
                );
                tempSelectionStorage = [];
            });

            cancelButton.addEventListener("click", function() {
                cancelSelection(dataListSelectionElement, dataListElement);
            });
        });
});
