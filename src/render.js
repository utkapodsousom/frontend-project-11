const createFeedsHTML = (feeds) => {
  let feedsHTML = '';
  feeds.forEach(({ title, description }) => {
    const layout = `
      <li class="feeds__item feed list-group-item">
        <h3 class="feed__title h5 m-0">${title}</h3>
        <p class="feed__description m-0 small text-black-50">${description}</p>
      </li>
    `;
    feedsHTML += layout;
  });
  return feedsHTML;
};

const createPostsHTML = (posts) => {
  let postsHTML = '';
  posts.forEach(({ id, postDescription, postLink }) => {
    const layout = `
      <li class="posts__item list-group-item d-flex justify-content-between align-items-start border-0">
        <a class="fw-bold" data-id="${id}" href="${postLink}" rel="noopener noreferrer" target="_blank">${postDescription}</a>
        <button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">Preview</button>
      </li>
    `;
    postsHTML += layout;
  });
  return postsHTML;
};

const renderFeeds = ({ feedsList }, { feeds }) => {
  feedsList.innerHTML = createFeedsHTML(feeds);
};

const renderPosts = ({ postsList }, { posts }) => {
  postsList.innerHTML = createPostsHTML(posts);
};

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
      elements.feedback.classList.remove('text-danger');
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
    case 'feeds':
      renderFeeds(elements, state);
      break;
    case 'posts':
      renderPosts(elements, state);
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
