import Notification from "../models/notification.model.js";

export const getMyNoitifications = async (req, res) => {
  try {
    console.log(req.user.authId);
    console.log("This is req user id", req?.user?.id);
    let userId = req.user.authId;
    let notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.authId,
      isRead: false,
    });

    return res.status(200).json(count);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    let { id } = req.params;
    await Notification.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      { new: true },
    );
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error " });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.authId;

    await Notification.updateMany(
      { userId },
      { $set: { isRead: true } },
      { new: true },
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const userId = req.user.authId;
    const notificaitons = await Notification.deleteMany({ userId });
    return res.status(200).json({
      message: "All notifications deleted successfully",
      notificaitons,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
