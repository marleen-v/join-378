
let dropDownOpen;

/**
 * This function is used to open and close the dropdown-menu
 *
 * 
 */
function openCloseDropdownMenu(){
const dropdownRef = document.getElementById("dropdown-menu");
 if (dropDownOpen) {
    dropdownRef.classList.add("d_none");
    dropDownOpen = false;
  } else if (!dropDownOpen) {
    dropdownRef.classList.remove("d_none");
    dropDownOpen = true;
  }
}
