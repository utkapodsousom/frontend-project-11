const handleError = (axios, error) => {
  if (error.isParsingError) {
    return 'noRSS';
  }

  if (axios.isAxiosError(error)) {
    return 'networkError';
  }

  return error.message;
};

export default handleError;
