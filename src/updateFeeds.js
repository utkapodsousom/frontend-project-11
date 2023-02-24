import axios from 'axios';
import { uniqueId } from 'lodash';
import parseData from './parser';
import getProxiedURL from './originProxy';
import handleError from './errorHandler';

const updateFeeds = (state) => {
  if (state.feeds.uniqueLinks.length === 0) {
    setTimeout(() => updateFeeds(state), 5000);
    return;
  }

  const requests = state.feeds.uniqueLinks.map((link) => {
    const request = axios.get(getProxiedURL(link)).catch((e) => {
      state.error = handleError(e);
    });
    return request;
  });

  Promise.all(requests).then((responses) => {
    responses.forEach((response) => {
      const responseDOM = parseData(response.data.contents);
      responseDOM.posts.forEach((post) => {
        const postLinks = state.posts.map((fetchedPost) => fetchedPost.postLink);
        if (!postLinks.includes(post.postLink)) {
          state.posts.push({ id: uniqueId(), ...post });
        }
      });
    });

    setTimeout(() => updateFeeds(state), 5000);
  });
};

export default updateFeeds;
