import "./index.css";
import { enableValidation, settings, resetValidation, disableButton } from "../scripts/validation.js";
import Api from "../utils/Api.js";
// const initialCards = [{
//   name: "Val Thorens",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
// },
// {
//   name: "Restaurant terrace",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
// },
// {
//   name: "An outdoor cafe",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
// },
// {
//   name: "A very long bridge, over the forest and through the trees",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
// },
// {
//   name: "Tunnel with morning light",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
// },
// {
//   name: "Mountain house",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
// }];

let selectedCard;
let selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "4a9c527e-cce7-4c53-a998-2f54988841d1",
    "Content-Type": "application/json"
  }
});

const profileImage = document.querySelector(".profile__avatar");

api.getAppInfo()
  .then(([cards, avatar]) => {
    console.log(cards);
    console.log(avatar);
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    })
    profileNameElement.textContent = avatar.name;
    profileDescriptionElement.textContent = avatar.about;
    profileImage.src = avatar.avatar;
  })
  .catch((err) => {
    console.error(err);
  });


// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__button_delete");

// Edit Profile Modal Section
// Edit Profile Button
const profileEditButton = document.querySelector(".profile__edt-btn");

// Page Name and Description current values
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(".profile__description");

// Edit Profile Modal
const editProfileModal = document.querySelector("#edit-profile-modal");
const editNameModalInput = editProfileModal.querySelector("#profile-name-input");
const editDescriptionModalInput = editProfileModal.querySelector("#profile-description-input");

// Access form on Edit Profile Modal
const editFormElement = editProfileModal.querySelector(".modal__form");

// Access Card Template and Card List
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Select Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Creates New Templates but doesn't add to CardsList
function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");



  cardNameElement.textContent = data.name;
  cardImageElement.alt = data.name;
  cardImageElement.src = data.link;


  // Event Listener on Delete Button
  cardDeleteBtn.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
  });

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardImageElement.addEventListener("click", () => {
     openModal(previewModal);
     previewModalImageEl.src = data.link;
     previewModalImageEl.alt = data.name;
     previewModalCaptionEl.textContent = data.name;

  });

  return cardElement;
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId) // pass the ID the the api function
    .then(() => {
      // remove the card from the DOM
      selectedCard.remove();
      // close the modal
      closeModal(deleteModal);
    })
    .catch(console.error);
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

// Function to Open Modal
function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleOverlayPress);
  document.addEventListener("keydown", handleEscapeModal);
}

// Function to Close Modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleOverlayPress);
  document.removeEventListener("keydown", handleEscapeModal);
}

// Submits Form on "Edit Profile" modal and updates profile on page
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api.editUserInfo({ name: editNameModalInput.value, about: editDescriptionModalInput.value})
    .then((data) => {
      profileNameElement.textContent = data.value;
      profileDescriptionElement.textContent = data.value;
      closeModal(editProfileModal);
    })
    .catch(console.error);

}


// Opens "Edit Profile Modal"
profileEditButton.addEventListener("click", () => {
  editNameModalInput.value = profileNameElement.textContent;
  editDescriptionModalInput.value = profileDescriptionElement.textContent;
  resetValidation(editFormElement, [editNameModalInput, editDescriptionModalInput], settings) // hides error message for both inputs if user received an error and closed modal without fixing the error
  openModal(editProfileModal);
});

// Submits text inputted through the profile modal and closes modal
editFormElement.addEventListener("submit", handleEditFormSubmit);


// "New Post" Modal Section

// New Post Button
const cardModalBtn = document.querySelector(".profile__add-btn"); //

// New Post submission Modal
const cardModal = document.querySelector("#add-card-profile-modal");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn")

// Accesses form on new form modal
const cardForm = cardModal.querySelector(".modal__form");

// Input information on Modal
const editLinkModalInput = cardModal.querySelector("#add-card-link-input");
const editCaptionModalInput = cardModal.querySelector("#add-card-name-input");

// Function to add new Card to page
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  api.addNewPost({name: editCaptionModalInput.value, link: editLinkModalInput.value})
    .then((data) => {
      const cardEl = getCardElement(data); // creates template from newCard object
      cardsList.prepend(cardEl); // Adds to beginning of array
      disableButton(cardSubmitBtn, settings); // disables button after submission so user can't submit without making an edit
      closeModal(cardModal);
      evt.target.reset();
    })
    .catch(console.error);
}

// Opens "New Post Modal"
cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

// Submits Post from Modal
cardForm.addEventListener("submit", handleCardFormSubmit);

// Closing the Modal using the Escape key and Overlay Click
function handleEscapeModal(evt) {
  if (evt.key === "Escape") {
    const modalOpened = document.querySelector(".modal_opened"); // Selects the Modal with the modal_opened attribute
    if (modalOpened) {
      closeModal(modalOpened.closest(".modal")); // closes the modal that is the closest ancestor to modal_opened (.modal in this case)
    }
  }
}

function handleOverlayPress(evt) {
  if (evt.target.classList.contains("modal")) { // what the user is clicking on has the modal attribute (anything that isn't the container when the modal is opened)
    closeModal(evt.target); // closes the modal
  }
}

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const closePopup = button.closest(".modal");
  button.addEventListener('click', () => closeModal(closePopup));
})

// Loops through array and creates a Template forEach object in array and adds to ul class ".cards__list"
// initialCards.forEach((item) => {
//   const cardEl = getCardElement(item);
//   cardsList.append(cardEl);
// });

enableValidation(settings);

