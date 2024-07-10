import {
  STATUS_CODES
} from '../helpers/constants.js';
import { AppError } from '../helpers/error.js';
import { isAvailable, sendResponse } from '../helpers/utils.js';
import { PostModel } from '../models/post.model.js';

export class PostController {
  /**
   * @description
   * the controller method to fetch all blogs for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of blogs for the user
   */
  static async getAllPosts(req, res, next) {
    try {
      const posts = await PostModel.getAllPosts();

      if (!posts.length) return next(new AppError('No post found', STATUS_CODES.NOT_FOUND));

      return sendResponse(res, STATUS_CODES.OK, 'All posts fetched successfully', posts);
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

/**
 * @description
 * the controller method to create a blog for a particular user
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {object} next the next middleware function in the application’s request-response cycle
 * @returns the created blog for the user
 */
  static async createPost(req, res, next) {
    const { body: requestBody } = req;
    requestBody.userId = res.locals.user.id;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(postCreationRequiredFields));

    if (!allFieldsArePresent) return next(new AppError('Some fields are missing', STATUS_CODES.BAD_REQUEST));

    const { title, description, user_id } = requestBody;
    try {
      const postCreateResult = await UserModel.createBlog(title, description, user_id);

      return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, 'Post created successfully', {
        id: postCreateResult.insertId,
        title,
        description,
        user_id
      });
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }
}