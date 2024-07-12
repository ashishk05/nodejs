import {
  STATUS_CODES,
  productCreationRequiredFields,
  possiblePostUpdateFields
} from '../helpers/constants.js';
import { AppError } from '../helpers/error.js';
import { isAvailable, sendResponse } from '../helpers/utils.js';
import { ProductModel } from '../models/product.model.js';


export class ProductController {
  /**
   * @description
   * the controller method to fetch all products for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of products for the user
   */
  static async getAllProducts(req, res, next) {
    try {
      const { body: requestBody } = req;
      
      const { user_id } = requestBody;
      
      const products = await ProductModel.getAllProducts(user_id);

      if (!products.length) return next(new AppError('No product found', STATUS_CODES.NOT_FOUND));

      return sendResponse(res, STATUS_CODES.OK, 'All products fetched successfully', products);
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
 * the controller method to create a product for a particular user
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {object} next the next middleware function in the application’s request-response cycle
 * @returns the created blog for the user
 */
  static async createProduct(req, res, next) {
    const formData = req;
    console.log('req==', formData);
  }

  /**
   * @description
   * the controller method to fetch the post corresponding to a post id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the post fetched from the database
   */
  static async getPostById(req, res, next) {
    const postId = req.params.id;

    try {
      const post = await PostModel.getPostById(postId);

      if (!post) return next(new AppError(`Post with id ${postId} not found`, STATUS_CODES.NOT_FOUND));

      return sendResponse(res, STATUS_CODES.OK, `Post with id ${postId} fetched successfully`, post);
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
   * the controller method to fetch all posts for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of posts for the user
   */
  static async updatePost(req, res, next) {
    const { body: requestBody } = req;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(possiblePostUpdateFields));

    if (!allFieldsArePresent) return next(new AppError('Some fields are required', STATUS_CODES.NOT_FOUND));

    try {
      const postId = req.params.id;

      const post = await PostModel.getPostById(postId);
      if (!post) return next(new AppError(`Post with id ${postId} not found`, STATUS_CODES.NOT_FOUND));

      // console.log('Id===', res.locals.user.id);
      // console.log('post.user_id===', post);

      if (post[0].user_id !== res.locals.user.id) return next(new AppError('You are not authorized', STATUS_CODES.FORBIDDEN));

      const postResult = await PostModel.updatePost(requestBody, postId);
      if (postResult.affectedRows) return sendResponse(res, STATUS_CODES.OK, `Post with id ${postId} updated successfully`);
      return next(new AppError(`Post with id ${postId} could not be updated`, STATUS_CODES.BAD_REQUEST));

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