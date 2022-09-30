import UserProfile from '../models/UserProfile';
import Sentry from '@sentry/node';

//  const accessControl = require('../config/accessRoles');

export default class UserController {
  static async apiGetUser (searchParameter) {
    if (!searchParameter) throw new Error('400 Empty search parameters');

    let dbQuery = {};

    if (searchParameter.name) dbQuery = { name: searchParameter.name };
    else if (searchParameter.email) dbQuery = { email: searchParameter.email };
    else if (searchParameter._id) dbQuery = { _id: searchParameter._id };
    else {
      throw new Error(
        '400 Wrong search parameters name, email, id are allowed'
      );
    }

    const user = await UserProfile.findOne(dbQuery).catch(error => {
      Sentry.captureException(error);
      throw error;
    });

    if (!user) return {};
    // const permission = accessControl.can('user').readAny('userProfile');
    // console.log('permission : ');
    // console.log(permission.granted);
    // console.log(permission.attributes);
    //
    // console.log('user before filter:', user);
    // console.log('user after filter', );

    // user = permission.filter(user);

    return user;
  }

  // TODO: field should be rename to role
  static async addProject (field, projectId, userId) {
    const user = await UserProfile.findByIdAndUpdate(userId, {
      $addToSet: { [field]: projectId }
    }).catch(error => {
      Sentry.captureException(error);
      throw error;
    });
    return user;
  }

  static async removeProject (field, projectId, userId) {
    const user = await UserProfile.findByIdAndUpdate(userId, {
      $pull: { [field]: projectId }
    }).catch(error => {
      Sentry.captureException(error);
      throw error;
    });
    return user;
  }

  static async addMessage (userId, messageId) {
    await UserProfile.findByIdAndUpdate(userId, {
      $addToSet: { messages: messageId }
    }).catch(error => {
      Sentry.captureException(error);
      throw error;
    });
  }

  static async deleteMessage (userId, messageId) {
    await UserProfile.findByIdAndUpdate(userId, {
      $pull: { messages: messageId }
    }).catch(error => {
      Sentry.captureException(error);
      throw error;
    });
  }

  static async findOrCreateUser (user, accessToken) {
    const retrievedUser = await UserProfile.findOneAndUpdate(
      { githubId: user.id },
      {
        githubId: user.id,
        name: user.login,
        authToken: accessToken,
        email: user.email
      },
      { new: true, upsert: true }
    ).catch(error => {
      Sentry.captureException(error);
      throw error;
    });

    return await retrievedUser;
  }

  static async updateUser (id, user) {
    const updatedUser = await UserProfile.findByIdAndUpdate(id, user, {
      new: true
    }).catch(error => {
      Sentry.captureException(error);
      throw error;
    });
    return updatedUser;
  }
}
