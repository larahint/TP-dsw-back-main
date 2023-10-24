
import { createApp } from './app.js';
import { serviceModel } from './models/services.js';
import { UserModel } from './models/users.js';
import { ProductModel } from './models/products.js';
import { servicesClientsModel } from "./models/services-clients.js";
import { branchModel } from "./models/branches.js";

createApp({
  serviceModel,
  userModel: UserModel,
  productModel: ProductModel,
  servicesClientsModel,
  branchModel
});
