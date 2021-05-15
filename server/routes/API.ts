import { Application } from "express";
/**
 *  ===================================
 *              API Routes
 *  ===================================
 */
export default class API {
  constructor(private app: Application) {
    this.registerRoutes();
  }

  /* Add the routes and controllers to the express server */
  private registerRoutes(): void {}
}
