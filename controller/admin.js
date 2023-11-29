const { Router } = require("express");
const isAuth = require("../middleware/admin");
const adminServices = require("../services/admin");
const router = Router({ strict: true });
router.post("/admin-login",adminServices.login);
router.get("/auth-admin", isAuth, adminServices.getAuthAdmin);
router.get("/users", isAuth, adminServices.getUsers);
router.post("/add-task", isAuth, adminServices.addTask);
router.get("/show-task/:id",isAuth,adminServices.showTask)
router.get("/view-task",isAuth,adminServices.viewTask)
router.delete("/cancel-task/:id",isAuth,adminServices.deleteTask);
router.put("/task/:id",isAuth,adminServices.updateTask);
router.put("/assign-task/:id",isAuth,adminServices.assignTask);
module.exports=router;