// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          console.log("I am here 1");
          event.preventDefault();
          event.stopPropagation();
          console.log("I am here 2");
        }
        console.log("I am here 3");
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
