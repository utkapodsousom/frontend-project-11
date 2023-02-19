const handleError = (axios, error) => {
  if (axios.isAxiosError(error)) {
    return 'networkError';
  }

  return error.message.key ?? 'unknown';
};

export default handleError;
