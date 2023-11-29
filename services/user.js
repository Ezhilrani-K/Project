const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const User = require("../models/user");
const Task = require("../models/task");


exports.register = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  if (!username || !password || !email || !role){
    return res.status(400).send("Please fill the required details");
  }
  try {
    const userObj = { username, email, role };
    const hashedPwd = await hash(password, 12);
    userObj.password = hashedPwd;
    const user = await new User(userObj).save();
    const token = sign({ [role]: user }, process.env.JWT_SECRET, { expiresIn: 360000 });
    return res
      .status(201)
      .json({ token, user: { ...user, password: null } });
  }
  catch (error) {
    return res.status(500).send(error.message);
  }
}





exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).lean();
    if (!user){
    return res.status(404).send("Invalid credentials");
    }
    if (user.role !== "user"){
      return res.status(404).send("Invalid credentials");
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch){
       return res.status(400).send("Invalid credentials");
    }
    else{
    const token = sign({ user }, process.env.JWT_SECRET, { expiresIn: 360000 });
    return res.status(200).json({ token, user: { ...user, password: null } });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req?.user?._id).select("-password").lean();
    if (!user){
      return res.status(400).send("No users is found with these details, Authorization denied..");
    }
    else{
    return res.status(200).json({ ...user });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


//get a task by passing an data to the field assigned to
exports.showTask = async (req, res, next) => {
  const id = req.params.id;
  try {
    res.status(200).json(await Task.find({ assignedTo: id }));
  }
  catch (err) {
    res.status(500).send(err.message);
  }
}



exports.updatetask = async (req, res) => {
  const id = req.params.id;
  const bodyData = req.body;
  try {
    const Taskupdate = await Task.findByIdAndUpdate(id, bodyData, { new: true });
    res.status(200).json(Taskupdate);

  }
  catch (error) {
    res.status(500).send(error.message);
  };
}


exports.getTask = async (req, res, next) => {
  const id = req.params.id;
  try {
    res.status(200).json(await Task.find({ _id: id }));
  }
  catch (err) {
    res.status(500).send(err.message);
  }
}


exports.getAllTask = async (req, res, next) => {
  try {
    res.status(200).json(await Task.find());
  }
  catch (err) {
    res.status(500).send(err.message);
  }
}

exports.getNotify = async (req, res) => {
  const id = req.params.id;
  const bodyData = req.body;
  try {
    const Taskupdate = await Task.findByIdAndUpdate(id, bodyData, { new: true });
    res.status(200).json(Taskupdate);

  }
  catch (error) {
    res.status(500).send(error.message);
  }
}