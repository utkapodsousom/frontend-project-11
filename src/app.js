import 'bootstrap/scss/bootstrap.scss';
import './style.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';

import resources from './locales';
import render from './render';

const handleError = (error) => error.message.key ?? 'unknown';

const app = async () => {
  await i18next.init({
    lng: 'en-US',
    resources,
  });

  yup.setLocale({
    string: {
      url: () => ({ key: 'invalidUrl' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'alreadyInList' }),
    },
  });

  const elements = {
    form: document.getElementById('form'),
    inputLabel: document.querySelector('.input-label'),
    input: document.getElementById('rss-url'),
    submitBtn: document.getElementById('form-submit'),
    feedback: document.querySelector('.feedback'),
    title: document.querySelector('.title'),
    subtitle: document.querySelector('.subtitle'),
  };

  // рендерим текст из i18next
  document.title = i18next.t('page.title');
  elements.title.textContent = i18next.t('page.title');
  elements.subtitle.textContent = i18next.t('page.subtitle');
  elements.inputLabel.textContent = i18next.t('page.inputPlaceholder');
  elements.input.setAttribute('placeholder', i18next.t('page.inputPlaceholder'));
  elements.submitBtn.textContent = i18next.t('page.addButton');

  const initialState = {
    formState: 'idle',
    error: null,
    feeds: [],
  };

  const watchedState = onChange(initialState, render(initialState, elements, i18next));

  // схема валидации урла, проверяем на наличие урла в стэйте
  const makeSchema = (addedLinks) => yup.string().required().url().notOneOf(addedLinks);

  const handleSubmit = (event) => {
    event.preventDefault();

    // получили ввод из инпута
    const formData = new FormData(event.target);
    const input = formData.get('url');
    const addedLinks = watchedState.feeds.map((feed) => feed);
    const schema = makeSchema(addedLinks);
    schema
      .validate(input)
      .then(() => {
        watchedState.error = null;
        watchedState.formState = 'submitting';
      })
      .then(() => {
        watchedState.formState = 'added';
        watchedState.feeds.push(input);
      })
      .catch((e) => {
        watchedState.formState = 'invalid';
        watchedState.error = handleError(e);
      });
  };

  elements.form.addEventListener('submit', handleSubmit);
};

export default app;
