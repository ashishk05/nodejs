import { UserController } from '../controllers/user.controller.js';
import { AuthMiddlewares } from '../middlewares/auth.middleware.js';
import { PostController } from '../controllers/post.controller.js';

// routes responsible for user and blog management
export const userRoutes = (app) => {
  app
    .route('/blogs')
    .get(UserController.getAllBlogs)
    .post(AuthMiddlewares.checkAuth, UserController.createBlog);

  app
    .route('/blogs/:id')
    .get(UserController.getBlogById)
    .patch(AuthMiddlewares.checkAuth, UserController.updateBlog)
    .delete(AuthMiddlewares.checkAuth, UserController.deleteBlog);

  app
    .route('/users/:id')
    .get(AuthMiddlewares.checkAuth, UserController.getUserById)
    .patch(AuthMiddlewares.checkAuth, UserController.updateUser)
    .delete(AuthMiddlewares.checkAuth, UserController.deleteUser);

    app
    .route('/posts')
    .get(PostController.getAllPosts)
    .post(AuthMiddlewares.checkAuth, PostController.createPost);

    app
    .route('/posts/:id')
    .get(PostController.getPostById)
    .patch(AuthMiddlewares.checkAuth, PostController.updatePost);
};
