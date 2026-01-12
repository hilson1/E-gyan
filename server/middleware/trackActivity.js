import { logActivity } from "../utils/logActivity.js";

export const trackActivity = (module, action = "view") => {
  return async (req, res, next) => {
    // userAuth already populated req.user
    const userId = req.user?.id;
    const itemId = req.params?.id || null;

    if (userId) {
      await logActivity({
        user_id: userId,
        module,
        action,
        item_id: itemId,
      });
    }

    next();
  };
};
