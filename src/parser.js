export default (data) => {
  const parser = new DOMParser();
  const parsedDOM = parser.parseFromString(data, 'application/xml');

  const parseError = parsedDOM.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingError = true;
    throw error;
  }

  const feedTitle = parsedDOM.querySelector('title').textContent;
  const feedDescription = parsedDOM.querySelector('description').textContent;

  const posts = Array.from(parsedDOM.querySelectorAll('item')).map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    const post = {
      postTitle,
      postDescription,
      postLink,
    };
    return post;
  }).reverse();

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  };
};
