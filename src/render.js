const renderState = (elements, value) => {
    console.log('called renderState()')
    switch (value) {
        case 'invalid':
            elements.input.classList.add('is-invalid');
            elements.error.classList.add('text-danger');
            break;
        case 'submitting':
            elements.input.classList.remove('is-invalid');
            elements.error.classList.remove('text-danger');
            break;
        case 'added':
            elements.input.classList.remove('is-invalid');
            elements.input.classList.remove('text-danger');
            elements.error.textContent = '';
            elements.form.reset();
            elements.input.focus();
            break;
        default:
            break;
    }
};

const renderError = (state, elements, error) => {
    if (error === null) {
        return;
    }
    elements.error.classList.add('text-danger');
    elements.error.textContent = state.error;
};

const render = (state, elements) => (path, value) => {
    switch (path) {
        case 'formState':
            renderState(elements, value);
            break;
        case 'error':
            renderError(state, elements, value);
            break;
        default:
            break;
    }
    console.log(state);
};

export default render;