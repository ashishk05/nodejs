import { Database } from '../config/db.config.js';

export class PostModel {
  /**
   * @description
   * the following method fetches all blogs from the database
   * @returns the array of blogs fetched from the database
   */
  static async getAllPosts() {
    const query = 'SELECT * FROM posts';

    const blogs = await Database.executeQuery(query);

    return blogs;
  }
}
