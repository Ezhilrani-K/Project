const {Router}=require("express");
const isAuth = require("../middleware/user");
const userService=require("../services/user");
const router=Router({strict:true});
router.post("/register",userService.register);
router.post("/login",userService.login);
router.get("/auth-user", isAuth, userService.getAuthUser);
router.get("/task/:id",isAuth,userService.showTask)
router.put("/tasks/:id",isAuth,userService.updatetask);
router.get("/tasks/:id",isAuth,userService.getTask);
router.get("/task",isAuth,userService.getAllTask);
router.put("/task-notifiy/:id",isAuth,userService.getNotify)
module.exports=router;


