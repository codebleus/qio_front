import Inputmask from 'inputmask';
import { addError, removeError } from '../utils/forms';

// --------------------------------------------------------------------------

const handleOnIncomplete = input => {
  input.value = '';
  if (input.closest('.field')) {
    addError(input.closest('.field'), input.closest('form'));
  }
};

const initInputmask = () => {
  const telInputCollection = document.querySelectorAll('[data-tel-mask]');
  const mailInputCollection = document.querySelectorAll('[data-mail-mask]');
  const nameInputCollection = document.querySelectorAll('[data-name-mask]');

  if (telInputCollection.length) {
    telInputCollection.forEach(input => {
      Inputmask({
        mask: '+7 (999) 999-99-99',
        showMaskOnHover: false,
        jitMasking: true,
        onincomplete: function () {
          handleOnIncomplete(input);
        },
        oncomplete: function () {
          // handleOnComplete(input);
        },
      }).mask(input);
    });
  }
  if (mailInputCollection.length) {
    mailInputCollection.forEach(input => {
      Inputmask({
        mask: '*{3,20}@*{3,20}.*{2,7}',
        showMaskOnHover: false,
        jitMasking: true,
        clearMaskOnLostFocus: true,
        clearIncomplete: true,
        onincomplete: function () {
          // handleOnIncomplete(input);
          if (input.closest('.field')) {
            input.closest('.field').classList.add('_incomplete');
          }
        },
        oncomplete: function () {
          if (input.closest('.field')) {
            input.closest('.field').classList.remove('_incomplete');
          }
        },
      }).mask(input);
    });
  }
  if (nameInputCollection.length) {
    nameInputCollection.forEach(input => {
      Inputmask({
        showMaskOnHover: false,
        jitMasking: true,
        regex: '^[а-яА-Яa-zA-Z]*[ ][а-яА-Яa-zA-Z]*$',
        onincomplete: function () {
          // handleOnIncomplete(input);
        },
        oncomplete: function () {
          // handleOnComplete(input);
        },
      }).mask(input);
    });
  }
};
initInputmask();
