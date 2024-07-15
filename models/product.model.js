import { Database } from '../config/db.config.js';

export class ProductModel {
  /**
   * @description
   * the following method fetches all products from the database
   * @returns the array of blogs fetched from the database
   */
  static async getAllProducts(user_id) {
    const params = { user_id };
    const query = 'SELECT * FROM products WHERE id = ?';

    const products = await Database.executeQuery(query, params);

    return products;
  }

  /**
   * @description
   * the following method creates a blog for a particular user
   * @param {string} title the title for the blog to be created
   * @param {string} description the description for the blog to be created
   * @param {number} userId the id of the user for whom the blog needs to be created
   * @returns the result of an sql insertion operation
   */
  static async createProduct(product_title, product_sku, product_price, description, product_sale_price, product_discount, product_image,  user_id) {
    const query = 'INSERT INTO products SET ?';
    const params = { user_id, product_title, product_sku, product_price, product_sale_price, product_discount, description, 	product_image };

    const result = await Database.executeQuery(query, params);

    return result;
  }

  static async getProductById(id) {
    const query = 'SELECT * FROM products WHERE id = ?';
    const param = [id];
    const result = await Database.executeQuery(query, param);

    return result;
  }

  static async updateProduct(reqObj, productId) {
    var query = 'UPDATE products SET updated_at = ?, ';

    const currentTime = new Date();
    const params = [currentTime];

    Object.entries(reqObj).forEach(([key, value], index) => {
      if (index === Object.keys(reqObj).length -1) query += `${key} = '${value}' WHERE id= ?`;
      else query += `${key} = '${value}', `;
    });
    params.push(productId);
    const result = await Database.executeQuery(query, params);
    return result;
  }
}
