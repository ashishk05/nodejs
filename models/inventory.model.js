import { Database } from '../config/db.config.js';

export class InventoryModel {
  /**
   * @description
   * the following method fetches all inventory from the database
   * @param {number} user_id the user id for get the inventory
   * @returns the array of Inventorys fetched from the database
   */
  static async getAllInventory(user_id) {
    const params = { user_id };
    const query = 'SELECT * FROM inventory WHERE id = ?';

    const products = await Database.executeQuery(query, params);

    return products;
  }

  /**
   * @description
   * the following method creates a inventory for a particular user and product
   * @param {number} product_id the product id for the inventory to be created
   * @param {number} user_id the user id for whom the inventory needs to be created
   * @param {number} quantity the quantity of the product
   * @returns the result of an sql insertion operation
   */
  static async createInventory(product_id, user_id, quantity) {
    const query = 'INSERT INTO inventory SET ?';
    const params = { product_id, user_id, quantity };

    const result = await Database.executeQuery(query, params);

    return result;
  }

  /**
   * @description
   * the following method creates a blog for a particular user
   * @param {number} id the id for the get inventory
   * @returns the result of an sql insertion operation
   */
  static async getInventoryById(id) {
    const query = 'SELECT * FROM inventory WHERE id = ?';
    const param = [id];
    const result = await Database.executeQuery(query, param);

    return result;
  }
}
