import "./index.css";
import { enableValidation, settings, resetValidation, disableButton } from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setLoadingText } from "../utils/helpers.js";


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


  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }


  cardNameElement.textContent = data.name;
  cardImageElement.alt = data.name;
  cardImageElement.src = data.link;


  // Event Listener on Delete Button
  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardImageElement.addEventListener("click", () => {
     openModal(previewModal);
     previewModalImageEl.src = data.link;
     previewModalImageEl.alt = data.name;
     previewModalCaptionEl.textContent = data.name;

  });

  return cardElement;
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-btn_liked");

  api
      .handleLike(id, isLiked)
      .then(() => {
        evt.target.classList.toggle("card__like-btn_liked");
      })
      .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteSubmit = evt.submitter;
  setLoadingText(true, deleteSubmit, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId) // pass the ID the the api function
    .then(() => {
      // remove the card from the DOM
      selectedCard.remove();
      // close the modal
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setLoadingText(false, deleteSubmit, "Delete", "Deleting...");
    });
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


  const submitBtn = evt.submitter;
  setLoadingText(true, submitBtn)


  api.editUserInfo({ name: editNameModalInput.value, about: editDescriptionModalInput.value})
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(()=>{
      setLoadingText(false, submitBtn);
    });

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
  const cardSubmit = evt.submitter;
  setLoadingText(true, cardSubmit);
  api.addNewPost({name: editCaptionModalInput.value, link: editLinkModalInput.value})
    .then((data) => {
      const cardEl = getCardElement(data); // creates template from newCard object
      cardsList.prepend(cardEl); // Adds to beginning of array
      disableButton(cardSubmitBtn, settings); // disables button after submission so user can't submit without making an edit
      closeModal(cardModal);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setLoadingText(false, cardSubmit);
    })
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

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarImg = document.querySelector(".profile__avatar");


avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
})

avatarForm.addEventListener("submit", handleAvatarSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const constAvtSubmit = evt.submitter;
  setLoadingText(true, constAvtSubmit)
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatarImg.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.err)
    .finally(() => {
      setLoadingText(false, constAvtSubmit);
    });
}

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const closePopup = button.closest(".modal");
  button.addEventListener('click', () => closeModal(closePopup));
})


enableValidation(settings);

