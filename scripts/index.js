const initialCards = [{
  name: "Val Thorens",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
},
{
  name: "Restaurant terrace",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
},
{
  name: "An outdoor cafe",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
},
{
  name: "A very long bridge, over the forest and through the trees",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
},
{
  name: "Tunnel with morning light",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
},
{
  name: "Mountain house",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
}];


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
const profileCloseButton = editProfileModal.querySelector(".modal__close-btn");

// Access Card Template and Card List
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Select Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn_type_preview");

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
  cardDeleteBtn.addEventListener("click", (item) => {
    item.target.closest(".card").remove();
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

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

// Function to Open Modal
function openModal(modal) {

  modal.classList.add("modal_opened");
}

// Function to Close Modal
function closeModal(modal) {

  modal.classList.remove("modal_opened");
}

// Submits Form on "Edit Profile" modal and updates profile on page
function handleEditFormSubmit(evt) {
  evt.preventDefault();

  profileNameElement.textContent = editNameModalInput.value;
  profileDescriptionElement.textContent = editDescriptionModalInput.value;
  closeModal(editProfileModal);
}


// Opens "Edit Profile Modal"
profileEditButton.addEventListener("click", () => {
  editNameModalInput.value = profileNameElement.textContent;
  editDescriptionModalInput.value = profileDescriptionElement.textContent;
  resetValidation(editFormElement, [editNameModalInput, editDescriptionModalInput], settings)
  openModal(editProfileModal);
});

// Closes "Edit Profile Modal"
profileCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

// Submits text inputted through the profile modal and closes modal
editFormElement.addEventListener("submit", handleEditFormSubmit);


// "New Post" Modal Section

// New Post Button
const cardModalBtn = document.querySelector(".profile__add-btn"); //

// New Post submission Modal
const cardModal = document.querySelector("#add-card-profile-modal");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn")
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");

// Accesses form on new form modal
const cardForm = cardModal.querySelector(".modal__form");

// Input information on Modal
const editLinkModalInput = cardModal.querySelector("#add-card-link-input");
const editCaptionModalInput = cardModal.querySelector("#add-card-name-input");

// Function to add new Card to page
function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const newCard = {name: editCaptionModalInput.value, link: editLinkModalInput.value};
  const cardEl = getCardElement(newCard); // creates template from newCard object
  cardsList.prepend(cardEl); // Adds to beginning of array
  disableButton(cardSubmitBtn);
  closeModal(cardModal);
  evt.target.reset();
}

// Opens "New Post Modal"
cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

// Closes "New Post Modal"
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

// Submits Post from Modal
cardForm.addEventListener("submit", handleCardFormSubmit);

// Loops through array and creates a Template forEach object in array and adds to ul class ".cards__list"
initialCards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardsList.append(cardEl);
});