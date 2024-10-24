
// This is used to open and close the dropdown-menu

document.addEventListener("DOMContentLoaded", function () {
  const dropdownButton = document.querySelector(".user-profil");
  console.log(dropdownButton)
  const dropdownMenu = document.getElementById("dropdown-menu");

  // Toggle the dropdown menu on button click
  dropdownButton.addEventListener('click', function (event) {
      dropdownMenu.classList.toggle('d_none');
      event.stopPropagation(); // Prevent event from bubbling up to body
  });

  // Close the dropdown menu when clicking anywhere else on the body
  document.body.addEventListener('click', function () {
      if (!dropdownMenu.classList.contains('d_none')) {
          dropdownMenu.classList.add('d_none');
      }
  });

});

