
import { Router } from "express";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { DeliveryLogsController } from "@/controllers/delivery-logs-controller";

const deliveryLogsRoutes = Router()
const deliveryLogsController = new DeliveryLogsController()


deliveryLogsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["SALE"]),
  deliveryLogsController.create
)


export { deliveryLogsRoutes }