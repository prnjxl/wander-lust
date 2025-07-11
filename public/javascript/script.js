// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


  // This is an example script, please modify as needed
  const rangeInput = document.getElementById('customRange4');
  const rangeOutput = document.getElementById('rangeValue');

  // Set initial value
 if (rangeInput && rangeOutput) {
  rangeOutput.textContent = rangeInput.value;
  rangeInput.addEventListener('input', function () {
    rangeOutput.textContent = this.value;
  });
}

//tax switch functionality
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
        taxSwitch.addEventListener("click", () => {
            let taxInfo = document.getElementsByClassName("tax-info");
            for(info of taxInfo){
                if(info.style.display != "inline"){
                    info.style.display = "inline";
                } else {
                    info.style.display = "none";
                }
            }
        });