import {
  STATUS_CODES,
  productCreationRequiredFields,
  possibleProductUpdateFields
} from '../helpers/constants.js';
import { AppError } from '../helpers/error.js';
import { isAvailable, sendResponse } from '../helpers/utils.js';
import { ProductModel } from '../models/product.model.js';
import upload from '../middlewares/upload.middleware.js';

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
 * @returns the created product image for the product
 */
  static async uploadProductImage(req, res, next) {

    try {
      upload.single('file')(req, res, (err) => {
        if (err) {
          return next(
            new AppError(
              err.message || 'File upload failed',
              err.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
              err.response || err
            )
          );
        }
        res.status(200).json({ message: 'File uploaded successfully', file: req.file });
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

/**
 * @description
 * the controller method to create a product for a particular user
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {object} next the next middleware function in the application’s request-response cycle
 * @returns the created product for the user
 */
  static async createProduct(req, res, next) {
    const { body: requestBody } = req;
    requestBody.user_id = res.locals.user.id;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(productCreationRequiredFields));

    if (!allFieldsArePresent) return next(new AppError('Some fields are missing', STATUS_CODES.BAD_REQUEST));
    requestBody.product_sale_price = requestBody.product_price - (requestBody.product_price * requestBody.product_discount / 100);
    
    const { product_title, product_sku, product_price, product_discount, product_image, description, user_id, product_sale_price } = requestBody;
    
    try {
      const productCreateResult = await ProductModel.createProduct(product_title, product_sku, product_price, description, product_sale_price, product_discount, product_image,  user_id);
      
      return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, 'Product added successfully', {
        id: productCreateResult.insertId,
        product_title,
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

  /**
   * @description
   * the controller method to fetch the product corresponding to a product id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the product fetched from the database
   */
  static async getProductById(req, res, next) {
    const productId = req.params.id;

    try {
      const product = await ProductModel.getProductById(productId);

      if (!product) return next(new AppError(`Product with id ${productId} not found`, STATUS_CODES.NOT_FOUND));

      return sendResponse(res, STATUS_CODES.OK, `Product with id ${productId} fetched successfully`, product);
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
   * the controller method to fetch all products for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of products for the user
   */
  static async updateProduct(req, res, next) {
    const { body: requestBody } = req;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(possibleProductUpdateFields));

    if (!allFieldsArePresent) return next(new AppError('Some fields are required', STATUS_CODES.NOT_FOUND));

    try {
      const productId = req.params.id;

      const product = await ProductModel.getProductById(productId);
      if (!product) return next(new AppError(`Product with id ${productId} not found`, STATUS_CODES.NOT_FOUND));

      requestBody.product_sale_price = requestBody.product_price - (requestBody.product_price * requestBody.product_discount / 100);

      if (product[0].user_id !== res.locals.user.id) return next(new AppError('You are not authorized', STATUS_CODES.FORBIDDEN));

      const productResult = await ProductModel.updateProduct(requestBody, productId);
      if (productResult.affectedRows) return sendResponse(res, STATUS_CODES.OK, `Product with id ${productId} updated successfully`);
      return next(new AppError(`Product with id ${productId} could not be updated`, STATUS_CODES.BAD_REQUEST));

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