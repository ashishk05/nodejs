import { InventoryController } from '../controllers/inventory.controller.js';
import { AuthMiddlewares } from '../middlewares/auth.middleware.js';

// routes responsible for user and blog management
export const inventoryRoutes = (app) => {
  
    app
    .route('/inventories')
    .get(AuthMiddlewares.checkAuth, InventoryController.getAllProductInventory)
    .post(AuthMiddlewares.checkAuth, InventoryController.createInventory);

    app
    .route('/inventories/:id')
    .get(InventoryController.getInventoryById);
    //.patch(AuthMiddlewares.checkAuth, InventoryController.updateInventory);
};
