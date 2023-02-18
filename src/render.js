const renderState = (elements, value, i18next) => {
  switch (value) {
    case 'invalid':
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      break;
    case 'submitting':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      break;
    case 'added':
      elements.input.classList.remove('is-invalid');
      elements.input.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t('info.success');
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const renderError = (state, { feedback }, error, i18next) => {
  if (error === null) {
    return;
  }
  feedback.classList.add('text-danger');
  feedback.textContent = i18next.t(`errors.${state.error}`);
};

const render = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(elements, value, i18next);
      break;
    case 'error':
      renderError(state, elements, value, i18next);
      break;
    default:
      break;
  }
  console.log(state);
};

export default render;
