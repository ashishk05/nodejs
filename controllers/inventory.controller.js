import {
  STATUS_CODES,
  inventoryCreationRequiredFields
} from '../helpers/constants.js';
import { AppError } from '../helpers/error.js';
import { isAvailable, sendResponse } from '../helpers/utils.js';
import { InventoryModel } from '../models/inventory.model.js';
import { ProductModel } from '../models/product.model.js';

export class InventoryController {
  /**
   * @description
   * the controller method to fetch all Inventory for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of Inventory for the user
   */
  static async getAllProductInventory(req, res, next) {
    try {
      const { body: requestBody } = req;
      
      const { user_id } = requestBody;
      
      const inventories = await InventoryModel.getAllInventory(user_id);

      if (!inventories.length) return next(new AppError('No inventory found', STATUS_CODES.NOT_FOUND));

      return sendResponse(res, STATUS_CODES.OK, 'All inventory fetched successfully', inventories);
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
 * the controller method to create a Inventory for a particular user
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {object} next the next middleware function in the application’s request-response cycle
 * @returns the created Inventory for the user
 */
  static async createInventory(req, res, next) {
    const { body: requestBody } = req;
    requestBody.user_id = res.locals.user.id;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(inventoryCreationRequiredFields));

    if (!allFieldsArePresent) return next(new AppError('Some fields are missing', STATUS_CODES.BAD_REQUEST));
    
    const { product_id, user_id, quantity } = requestBody;
    
    try {
      const inventoryCreateResult = await InventoryModel.createInventory(product_id, user_id, quantity);
      
      const productDetail = await ProductModel.getProductById(product_id);

      return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, 'Inventory added successfully', {
        id: inventoryCreateResult.insertId,
        productDetail
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
   * the controller method to fetch the Inventory corresponding to a product id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the Inventory fetched from the database
   */
  static async getInventoryById(req, res, next) {
    const inventoryId = req.params.id;

    try {
      const inventory = await InventoryModel.getInventoryById(inventoryId);

      if (!inventory) return next(new AppError(`Inventory with id ${inventoryId} not found`, STATUS_CODES.NOT_FOUND));

      return sendResponse(res, STATUS_CODES.OK, `Inventory with id ${inventoryId} fetched successfully`, inventory);
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