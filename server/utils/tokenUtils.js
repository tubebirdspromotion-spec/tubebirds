import jwt from 'jsonwebtoken';

const resolveUserId = (user) => user?.id ?? user?._id ?? user?.dataValues?.id;

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export const sendTokenResponse = (user, statusCode, res, additionalData = {}) => {
  const userId = resolveUserId(user);
  if (!userId) {
    throw new Error('Unable to resolve user id for token generation');
  }
  const token = generateToken(userId);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      ...additionalData
    }
  });
};
