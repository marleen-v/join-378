/**
 * This function is used to open and close the dropdown-menu
 *
 * 
 */
function openCloseDropdownMenu(){
    const dropdownRef = document.getElementById(".dropdown-menu");
    if(dropdownRef.classList.contains("d_none")){
        dropdownRef.classList.remove("d_none");
    } else {
        dropdownRef.classList.add("d_none");
    }
}