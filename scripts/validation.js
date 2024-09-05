const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_type_error",
  inputErrorClass: "modal__input_type_error",
  // errorClass: "modal__error_visible"
}

// Adds error message from modal
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorMsgEl = formElement.querySelector(`#${inputElement.id}-error`); // finds specific error html (span tag) for modal using ID from the modal__form
  errorMsgEl.textContent = errorMessage; // gets specific errorMessage from the .validationMessage property and adds it to span tag
  inputElement.classList.add(config.inputErrorClass); // adds CSS for errorMessage
};

// Removes error message from modal
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`); // finds specific error html (span tag) for modal using ID from the modal__form
  errorElement.textContent = ""; // removes error message
  inputElement.classList.remove(config.inputErrorClass); // removes CSS for error message
};

// Tells if at least ONE of the inputs are invalid
const hasInvalidInput = (inputList) => {
  // If both Inputs are correct will return false, if at least one input is incorrect it will return true
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid; // Will return whether current input is valid or invalid
  });
};

// Checks whether button should be disabled or enabled
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    // If button has at least one invalid input (which it should by default) disables button. (User must make changes in the edit profile modal and the New Post modal must have a valid input)
    disableButton(buttonElement);
    buttonElement.classList.add(config.inactiveButtonClass); // Adds inactive button css (greys out the button)
  } else {
    // If correct input then enables button and removes inactive button css
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

// function for  disabling the buttonElement, this allows us to disable button from button submit in index.js
const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
}

// Hides error messages when opening modal (used for edit profile modal), so when user has an error in the modal and reopens it, the error does not reappear when there shouldn't be
const resetValidation = (formElement, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input, config);
  });

};

// Checks on whether input is valid or not
const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    // if inputElement is invalid then showcases error on Input
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    // Otherwise it doesn't show error
    hideInputError(formElement, inputElement, config);
  }
}

// This sets the event listeners for both modals on the page
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector)); // gets the inputs for each modal (currently 2 inputs per modal)
  const buttonElement = formElement.querySelector(config.submitButtonSelector); // gets the submit button in the modal


  toggleButtonState(inputList, buttonElement, config); // creates inactive button state from webpage launch

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () { // Adds both functions to each input on both Modals
      checkInputValidity(formElement, inputElement, config); // For every input checks to see if input is valid
      toggleButtonState(inputList, buttonElement, config); // if input is valid/invalid button should follow that
    });
  });
};

// Enables all functions in validation.js
const enableValidation = (config) => {
  // Iterate through the forms and set event listeners throughout the form
  const formList = document.querySelectorAll(config.formSelector); // both forms on the webpage
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
}

enableValidation(settings);