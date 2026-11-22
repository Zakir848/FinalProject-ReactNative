export const generateToken = (userId: string) => {
  const token = {
    userId,
    createAt: Date.now(),
    expireAt: Date.now() * 60 * 60 * 1000,
  };

  return JSON.stringify(token);
};
