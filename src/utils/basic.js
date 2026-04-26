const response = (res, status, message = null, data = null, error = null) => {
  const r = {
    success: status >= 200 && status < 300,
  };

  if (message) r.message = message;
  if (data) r.data = data;
  if (error) r.error = error;

  return res.status(status).json(r);
};

export default { response };
