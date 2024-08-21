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

const profileEditButton = document.querySelector(".profile__edt-btn");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = editProfileModal.querySelector(".modal__form");
const modalCloseButton = editProfileModal.querySelector(".modal__close-btn");
const editNameModalInput = editProfileModal.querySelector("#profile-name-input");
const editDescriptionModalInput = editProfileModal.querySelector("#profile-description-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");

  cardNameElement.textContent = data.name;
  cardImageElement.alt = data.name;
  cardImageElement.src = data.link;

  return cardElement;
}

function openModal(modal) {


  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

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
  openModal(editProfileModal);
});

// Closes "Edit Profile Modal"
modalCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

// Submits text inputted through the profile modal and closes modal
editFormElement.addEventListener("submit", handleEditFormSubmit);


// New Post submission Modal
const cardModal = document.querySelector("#add-card-profile-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");


cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});



initialCards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardsList.append(cardEl);
});