import { tempUser, Task } from "../models/temuser.js";

export const createUser = async (req, res ) => {
    const { name } = req.body;
    await tempUser.sync();
    const user = await tempUser.create({
        name,
    })

    console.log("created user")
    
    return res.status(200).json({
      success: false,
      message: "created user",
      data: user
    });
}

export const createTask = async (req, res ) => {
    const { name, tempuserId } = req.body;

    await Task.sync();
    const task = await Task.create({
      name,
      tempuserId,
    });

    console.log("created user")

    return res.status(200).json({
      success: false,
      message: "created task",
      data: task
    });
}

export const getAllTask = async (req, res ) => {
    const { name } = req.body;

    const alltask =  await Task.findAll({ include: tempUser });

    console.log(alltask);

    return res.status(200).json({
      success: false,
      message: "All the task",
      data: alltask
    });
}
