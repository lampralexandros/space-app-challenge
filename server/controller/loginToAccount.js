import UserProfile from '../models/UserProfile';
import AuthJwt from '../routes/authJWT';
import env from '../config/env';

export async function loginToAccount (login) {
  if (!verifyLogin(login.username, login.password)) return null;

  const user = await UserProfile.findOne({ name: login.username });

  if (!user) return user;
  if (!verifyPassWord(user.passwordSalted, login.password)) return null;

  const userAnswer = {
    ownedProjects: user.ownedProjects,
    accessToken: AuthJwt.generateToken({ userId: user._id }),
    refreshTokenJWT: AuthJwt.generateRefreshToken({
      userId: user._id
    }),
    jwtExpires: env.JWT_ACCESS_TOKEN_LIFE(),
    refreshExpires: env.JWT_REFRESH_TOKEN_LIFE(),
    login: user.name,
    email: user.email,
    followers: '0',
    public_repos: '0',
    owned_private_repos: '0',
    git_image_user: ''
  };

  return userAnswer;
}

export function verifyPassWord (storedPassSalted, password) {
  if (!storedPassSalted) return false;
  const passwordToVerify = password;
  return passwordToVerify === storedPassSalted;
}

export function verifyLogin (username, password) {
  if (!username) return false;
  if (!password) return false;
  return true;
}
