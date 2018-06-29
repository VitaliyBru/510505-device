'use strict';

var overlayEl = document.querySelector('.overlay');
var feedbackTriggerEl = document.querySelector('.feedback-trigger');
var feedbackEl = document.querySelector('.feedback-content');
var feedbackFormEl = feedbackEl.querySelector('.feedback-form');
var closeFeedbackEl = feedbackEl.querySelector('.popup-close');
var inputElts = feedbackEl.querySelectorAll('.feedback-input');
var isLocalStorageSupport = true;
var errorState = [];

var openFedbackPopup = function() {
  overlayEl.classList.add('popup-visible');
  feedbackEl.classList.add('popup-visible');
  feedbackPreset();
  feedbackTriggerEl.removeEventListener('click', onFeedbackTriggerClick);
  overlayEl.addEventListener('click', onOverlayClick);
  closeFeedbackEl.addEventListener('click', onClosefeedbackClick);
  feedbackFormEl.addEventListener('submit', onFormSubmit);
  feedbackFormEl.addEventListener('input', onInput);
}

var closeFedbackPopup = function() {
  overlayEl.classList.remove('popup-visible');
  feedbackEl.classList.remove('popup-visible');
  inputElts.forEach(function(it) { it.classList.remove('feedback-input--invalid'); });
  feedbackTriggerEl.addEventListener('click', onFeedbackTriggerClick);
  overlayEl.removeEventListener('click', onOverlayClick);
  closeFeedbackEl.removeEventListener('click', onClosefeedbackClick);
  feedbackFormEl.removeEventListener('submit', onFormSubmit);
  feedbackFormEl.reset();
}

var feedbackPreset = function() {
  try {
    inputElts.forEach(function(it) {
      if (it.id !== 'message') {
        it.value = localStorage.getItem(it.id);
      }
    });
  } catch (err) {
    isLocalStorageSupport = false;
  }

  var isFocusSet = false;
  inputElts.forEach(function(it) {
    if (!it.value && !isFocusSet) {
      it.focus();
      isFocusSet = true;
    }
  });
}

var onInput = function(evt) {
  if (evt.target.value && errorState[evt.target.id]) {
    evt.target.classList.remove('feedback-input--invalid');
    errorState[evt.target.id] = false;
  } else if (!evt.target.value && !errorState[evt.target.id]) {
    evt.target.classList.add('feedback-input--invalid');
    errorState[evt.target.id] = true;
  }
}

var onFormSubmit = function(evt) {
  evt.preventDefault();
  var isFormCorrect = true;
  inputElts.forEach(function(it) {
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
      inputElts.forEach(function(it) {
        if (it.id !== 'message') {
          localStorage.setItem(it.id, it.value);
        }
      });
    }
    feedbackFormEl.submit();
    closeFedbackPopup();
  }
}

var onClosefeedbackClick = function(evt) {
  evt.preventDefault();
  closeFedbackPopup();
}

var onOverlayClick = onClosefeedbackClick;

var onFeedbackTriggerClick = function(evt) {
  evt.preventDefault();
  openFedbackPopup();
}

feedbackTriggerEl.addEventListener('click', onFeedbackTriggerClick);