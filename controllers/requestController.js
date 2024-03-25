import Request from "../models/requestModel.js";
import User from "../models/userModel.js";

export const getAllRequest = async (req, res) => {
  try {
    const allRequests = await Request.findAll({
      where: {
        status: "pending",
      },
      include: User
    });

    if (!allRequests || allRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Pending Requests",
      });
    }

    res.status(200).json({
      success: true,
      message: "Requests Found",
      data: allRequests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const AcceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = Request.findByPk(id);

    if (!request) {
      res.status(400).json({
        success: false,
        message: "Request not found",
      });
    }

    const user = await User.findByPk(request.UserId);

    user.hasAccess = true;
    await user.save();

    request.status = "approved";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Requests Accepted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
