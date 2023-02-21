import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import { uniqueId } from 'lodash';

import resources from './locales';
import render from './render';
import getProxiedURL from './originProxy';
import XMLParser from './parser';
import handleError from './errorHandler';
import updateFeeds from './updateFeeds';

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
    feedsList: document.querySelector('.feeds__list'),
    postsList: document.querySelector('.posts__list'),
    feedsColumn: document.querySelector('.feeds'),
    postsColumn: document.querySelector('.posts'),
    modalWindow: {
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      linkBtn: document.querySelector('.modal-footer a'),
      closeBtn: document.querySelector('.modal-footer button'),
    },
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
    uniqueLinks: [],
    feeds: [],
    posts: [],
    uiState: {
      selectedPostId: null,
      readPosts: new Set(),
    },
  };

  const watchedState = onChange(initialState, render(initialState, elements, i18next));
  updateFeeds(watchedState);

  // схема валидации урла, проверяем на наличие урла в стэйте
  const makeSchema = (addedLinks) => yup.string().required().url().notOneOf(addedLinks);

  // ссылка на сгенерированный RSS для тестирования
  // https://lorem-rss.hexlet.app/feed

  const postLinkClickListener = (event) => {
    let postId;
    if (event.target.classList.contains('btn')) {
      postId = event.target.dataset.id;
      watchedState.uiState.selectedPostId = postId;
    }
    if (event.target.classList.contains('fw-bold')) {
      const btnElement = event.target.nextElementSibling;
      postId = btnElement.dataset.id;
    }
    watchedState.uiState.readPosts.add(postId);
  };

  const postsContainer = document.querySelector('.posts');
  postsContainer.addEventListener('click', postLinkClickListener);

  const handleSubmit = (event) => {
    event.preventDefault();

    // получили ввод из инпута
    const formData = new FormData(event.target);
    const input = formData.get('url');
    const addedLinks = watchedState.uniqueLinks.map((link) => link);
    const schema = makeSchema(addedLinks);
    schema
      .validate(input)
      .then(() => {
        watchedState.error = null;
        watchedState.formState = 'submitting';
      })
      .then(() => {
        axios
          .get(getProxiedURL(input))
          .then(({ data: { contents } }) => {
            const { feed, posts } = XMLParser(contents);
            watchedState.feeds.push(feed);
            posts.forEach((post) => {
              watchedState.posts.push({ id: uniqueId(), ...post });
            });
            watchedState.error = null;
            watchedState.formState = 'added';
            watchedState.uniqueLinks.push(input);
          })
          .catch((e) => {
            watchedState.error = handleError(axios, e);
          });
      })
      .catch((e) => {
        watchedState.formState = 'invalid';
        watchedState.error = handleError(axios, e);
      });
  };

  elements.form.addEventListener('submit', handleSubmit);
};

export default app;
