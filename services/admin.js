const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const Admin = require("../models/admin");
const User = require("../models/user");
const Task = require("../models/task");



exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username }).lean();
    if (!admin) {
      return res.status(404).send("Invalid credentials");
    }
    if (admin.role !== "admin") {
      return res.status(404).send("Invalid credentials..");
    }
    const isMatch = await compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    else {
      const token = sign({ admin }, process.env.JWT_SECRET, {
        expiresIn: 360000,
      });
      return res.status(200).json({ token, admin });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


//check the authentication for admin
exports.getAuthAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req?.admin?._id).select("-password").lean();
    if (!admin) {
      return res.status(400).send("Admin not found, Authorization denied..");
    }
    else {
      return res.status(200).json({ ...admin });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};



//get all users details
exports.getUsers = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(400).send("You dont have permission");
    }
    else {
      return res.status(200).json(await User.find().lean());
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};


//adding a new task in db
exports.addTask = async (req, res, next) => {
  const { taskName, description, assignedTo, duration, status, taskId, comments } = req.body;
  if (!taskName || !description || !assignedTo || !duration || !status || !taskId) {
    return res.status(400).send("Please fill the required details")
  }
  try {
    const userObj = { taskName, description, assignedTo, duration, status, taskId, comments };
    const user = await new Task(userObj).save();
    return res
      .status(201)
      .json({ ...user, password: null });
  }
  catch (error) {
    return res.status(500).send(error.message);
  }
}


//view all task from db
exports.viewTask = async (req, res, next) => {
  try {
    res.status(200).json(await Task.find());
  }
  catch (err) {
    res.status(500).send(err.message);
  }
}






exports.deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    res.status(200).send(await Task.findByIdAndDelete(id))
  }
  catch (error) {
    res.status(500).send(error.message);
  }
}

exports.updateTask = async (req, res) => {
  const id = req.params.id;
  const bodyContent = req.body;
  try {
    const Taskupdate = await Task.findByIdAndUpdate(id, bodyContent, { new: true });
    res.status(200).json(Taskupdate);

  }
  catch (error) {
    res.status(500).send(error.message);
  };
}

exports.assignTask = async (req, res) => {
  const id = req.params.id;
  const bodyContent = req.body;
  try {
    const Taskupdate = await Task.findByIdAndUpdate(id, bodyContent, { new: true });
    res.status(200).json(Taskupdate);
  }
  catch (error) {
    res.status(500).send(error.message);
  };
}

exports.showTask = async (req, res, next) => {
  const id = req.params.id;
  try {
    res.status(200).json(await Task.find({ assignedTo: id }));
  }
  catch (err) {
    res.status(500).send(err.message);
  }
}
