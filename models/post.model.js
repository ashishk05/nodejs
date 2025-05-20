import { Database } from '../config/db.config.js';

export class PostModel {
  /**
   * @description
   * the following method fetches all blogs from the database
   * @returns the array of blogs fetched from the database
   */
  static async getAllPosts(user_id, search = '', page = 1, limit = 1) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM posts 
      WHERE user_id = ? AND post_title LIKE ? 
      LIMIT ? OFFSET ?
    `;
    
    const params = [user_id, `%${search}%`, limit, offset];
    const posts = await Database.executeQuery(query, params);
    return posts;
  }


  /**
   * @description
   * the following method creates a blog for a particular user
   * @param {string} title the title for the blog to be created
   * @param {string} description the description for the blog to be created
   * @param {number} userId the id of the user for whom the blog needs to be created
   * @returns the result of an sql insertion operation
   */
  static async createPost(post_title, description, user_id) {
    const query = 'INSERT INTO posts SET ?';
    const params = { user_id, post_title, description };
    const result = await Database.executeQuery(query, params);
    return result;
  }

  static async getPostById(id) {
    const query = 'SELECT * FROM posts WHERE id = ?';
    const param = [id];
    const result = await Database.executeQuery(query, param);
    return result;
  }

  static async updatePost(reqObj, postId) {
    var query = 'UPDATE posts SET updated_at = ?, ';

    const currentTime = new Date();
    const params = [currentTime];

    Object.entries(reqObj).forEach(([key, value], index) => {
      if (index === Object.keys(reqObj).length -1) query += `${key} = '${value}' WHERE id= ?`;
      else query += `${key} = '${value}', `;
    });

    params.push(postId);
    const result = await Database.executeQuery(query, params);
    return result;
  }
}
