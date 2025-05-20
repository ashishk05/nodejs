import { PostController } from '../controllers/post.controller.js';
import { AuthMiddlewares } from '../middlewares/auth.middleware.js';

// routes responsible for user and blog management
export const postRoutes = (app) => {
  
    app
    .route('/posts')
    .get(AuthMiddlewares.checkAuth, PostController.getAllPosts)
    .post(AuthMiddlewares.checkAuth, PostController.createPost);

    app
    .route('/posts/:id')
    .get(PostController.getPostById)
    .patch(AuthMiddlewares.checkAuth, PostController.updatePost);
};
