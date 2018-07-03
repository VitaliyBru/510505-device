'use strict';

var POPUP_BOUNDS_DURATION = 300;
// Общая переменная
var overlayEl = document.querySelector('.overlay');
// Переменные используемые с окном обратной связи
var feedbackTriggerEl = document.querySelector('.feedback-trigger');
var feedbackEl = document.querySelector('.feedback-content');
var feedbackFormEl = feedbackEl.querySelector('.feedback-form');
var closeFeedbackEl = feedbackEl.querySelector('.popup-close');
var inputElts = Array.prototype.slice.call(feedbackEl.querySelectorAll(
    '.feedback-input'));
var isLocalStorageSupport = true;
var errorState = [];
// Переменные используемые с картой
var mapShowTrigger = document.querySelector('.location-map');
var mapEl = document.querySelector('.map-popup');
var closeMapEl = mapEl.querySelector('.popup-close');

var openFedbackPopup = function () {
  overlayEl.classList.add('popup-visible');
  feedbackEl.classList.add('popup-visible');
  feedbackEl.classList.add('feedback-show-up');
  feedbackPreset();
  feedbackTriggerEl.removeEventListener('click', onFeedbackTriggerClick);
  mapShowTrigger.removeEventListener('click', onMapTriggerClick);
  overlayEl.addEventListener('click', onOverlayClick);
  closeFeedbackEl.addEventListener('click', onClosefeedbackClick);
  feedbackFormEl.addEventListener('submit', onFormSubmit);
  feedbackFormEl.addEventListener('input', onInput);
  document.addEventListener('keydown', onEscKeyDown);
};

var closeFedbackPopup = function () {
  overlayEl.classList.remove('popup-visible');
  feedbackEl.classList.remove('popup-visible', 'feedback-show-up');
  inputElts.forEach(function(it) { it.classList.remove('feedback-input--invalid'); });
  feedbackTriggerEl.addEventListener('click', onFeedbackTriggerClick);
  mapShowTrigger.addEventListener('click', onMapTriggerClick);
  overlayEl.removeEventListener('click', onOverlayClick);
  closeFeedbackEl.removeEventListener('click', onClosefeedbackClick);
  feedbackFormEl.removeEventListener('submit', onFormSubmit);
  feedbackFormEl.reset();
  document.removeEventListener('keydown', onEscKeyDown);
};

var closePopup = function () {
  feedbackEl.classList.contains('popup-visible') ? closeFedbackPopup()
      : onCloseMapClick();
};

var onEscKeyDown = function (evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    closePopup();
  }
};

var feedbackPreset = function () {
  try {
    inputElts.forEach(function (it) {
      if (it.id !== 'message') {
        it.value = localStorage.getItem(it.id);
      }
    });
  } catch (err) {
    isLocalStorageSupport = false;
  }

  var isFocusSet = false;
  inputElts.forEach(function (it) {
    if (!it.value && !isFocusSet) {
      it.focus();
      isFocusSet = true;
    }
  });
};

var onInput = function (evt) {
  if (evt.target.value && errorState[evt.target.id]) {
    evt.target.classList.remove('feedback-input--invalid');
    errorState[evt.target.id] = false;
  } else if (!evt.target.value && !errorState[evt.target.id]) {
    evt.target.classList.add('feedback-input--invalid');
    errorState[evt.target.id] = true;
  }
};

var onFormSubmit = function (evt) {
  evt.preventDefault();
  var isFormCorrect = true;
  inputElts.forEach(function (it) {
    if (!it.value) {
      it.classList.add('feedback-input--invalid');
      isFormCorrect = false;
      errorState[it.id] = true;
    } else {
      errorState[it.id] = false;
    }
  });
  if (isFormCorrect) {
    if (isLocalStorageSupport) {
      inputElts.forEach(function (it) {
        if (it.id !== 'message') {
          localStorage.setItem(it.id, it.value);
        }
      });
    }
    feedbackFormEl.submit();
    closeFedbackPopup();
  } else {
    feedbackEl.classList.remove('feedback-show-up');
    feedbackEl.classList.add('feedback-content--invalid');
    setTimeout(function () { feedbackEl.classList.remove('feedback-content--invalid') }, POPUP_BOUNDS_DURATION);
  }
};

var onClosefeedbackClick = function (evt) {
  evt.preventDefault();
  closeFedbackPopup();
};

var onOverlayClick = onClosefeedbackClick;

var onFeedbackTriggerClick = function (evt) {
  evt.preventDefault();
  openFedbackPopup();
};

var onMapTriggerClick = function () {
  overlayEl.classList.add('popup-visible');
  mapEl.classList.add('popup-visible');
  mapEl.classList.add('map-show-up');
  mapShowTrigger.removeEventListener('click', onMapTriggerClick);
  feedbackTriggerEl.removeEventListener('click', onFeedbackTriggerClick);
  overlayEl.addEventListener('click', onCloseMapClick);
  closeMapEl.addEventListener('click', onCloseMapClick);
  document.addEventListener('keydown', onEscKeyDown);
};

var onCloseMapClick = function () {
  overlayEl.classList.remove('popup-visible');
  mapEl.classList.remove('popup-visible', 'map-show-up');
  mapShowTrigger.addEventListener('click', onMapTriggerClick);
  feedbackTriggerEl.addEventListener('click', onFeedbackTriggerClick);
  overlayEl.removeEventListener('click', onCloseMapClick);
  closeMapEl.removeEventListener('click', onCloseMapClick);
  document.removeEventListener('keydown', onEscKeyDown);
};

feedbackTriggerEl.addEventListener('click', onFeedbackTriggerClick);
mapShowTrigger.addEventListener('click', onMapTriggerClick);