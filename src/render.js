import { isEmpty } from 'lodash';

const createFeedsList = (feeds, i18next) => {
  const fragment = document.createDocumentFragment();
  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('feeds__title');
  feedsTitle.textContent = i18next.t('page.feedsTitle');
  fragment.append(feedsTitle);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'feeds__list');
  feeds.forEach(({ title, description }) => {
    ul.innerHTML += `
    <li class="feeds__item feed list-group-item">
      <h3 class="feed__title h5 m-0">${title}</h3>
      <p class="feed__description m-0 small text-black-50">${description}</p>
    </li>`;
  });
  fragment.append(ul);
  return fragment;
};

const createPostsColumn = (posts, i18next) => {
  const fragment = document.createDocumentFragment();
  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('posts__title');
  postsTitle.textContent = i18next.t('page.postsTitle');
  fragment.append(postsTitle);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'posts__list');
  posts.forEach(({ id, postLink, postTitle }) => {
    ul.innerHTML += `
      <li class="posts__item list-group-item d-flex justify-content-between align-items-start border-0">
        <a class="fw-bold" data-id="${id}" href="${postLink}" rel="noopener noreferrer" target="_blank">${postTitle}</a>
        <button 
          type="button"
          class="btn btn-outline-primary btn-sm" 
          data-id="${id}" 
          data-bs-toggle="modal" 
          data-bs-target="#modal">
            ${i18next.t('page.postButton')}
        </button>
      </li>`;
  });
  fragment.append(ul);
  return fragment;
};

const makeReadLinks = (links, countainer) => {
  links.forEach((link) => {
    const linkElement = countainer.querySelector(`a[href="${link}"]`);
    linkElement.classList.remove('fw-bold');
    linkElement.classList.add('fw-normal', 'link-secondary');
  });
};

const renderPosts = (state, elements, value, i18next) => {
  elements.postsColumn.innerHTML = '';
  elements.postsColumn.append(createPostsColumn(value, i18next));
  if (state.uiState.readPosts.length !== 0) {
    const idReadPosts = Array.from(state.uiState.readPosts);
    const links = value.filter(({ id }) => idReadPosts.includes(id)).map((post) => post.postLink);
    makeReadLinks(links, elements.postsColumn);
  }
};

const renderState = (elements, value, i18next) => {
  switch (value) {
    case 'invalid':
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      break;
    case 'submitting':
      elements.input.classList.remove('is-invalid');
      elements.submitBtn.disabled = true;
      elements.feedback.classList.remove('text-danger');
      break;
    case 'added':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.submitBtn.disabled = false;
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
  feedback.textContent = '';
  feedback.classList.add('text-danger');
  feedback.textContent = i18next.t(`errors.${state.error}`);
};

const render = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'error':
      if (!isEmpty(value)) {
        renderError(state, elements, value, i18next);
      }
      break;

    case 'feeds.uniqueLinks':
    case 'formState':
      renderState(elements, value, i18next);
      break;

    case 'feeds.data':
      elements.feedsColumn.innerHTML = '';
      elements.feedsColumn.prepend(createFeedsList(value, i18next));
      break;

    case 'posts':
      renderPosts(state, elements, value, i18next);
      break;

    case 'uiState.selectedPostId': {
      const {
        title, body, linkBtn, closeBtn,
      } = elements.modalWindow;
      const selectedPost = state.posts.find((post) => post.id === value);
      title.textContent = selectedPost.postTitle;
      body.textContent = selectedPost.postDescription;
      linkBtn.setAttribute('href', selectedPost.postLink);
      linkBtn.textContent = i18next.t('page.postButton');
      closeBtn.textContent = i18next.t('page.modalCloseBtn');
      break;
    }

    case 'uiState.readPosts': {
      const idPosts = Array.from(value);
      const links = state.posts
        .filter(({ id }) => idPosts.includes(id))
        .map((post) => post.postLink);
      makeReadLinks(links, elements.postsColumn);
      break;
    }

    default:
      elements.feedback.textContent = '';
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = i18next.t('errors.unknown');
  }

  console.log(state);
};

export default render;
