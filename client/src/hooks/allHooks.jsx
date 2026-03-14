import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import axios from "axios";
import { useEffect } from "react";
import {
  setAddress,
  setCount,
  setMyProfile,
  setNotifications,
  setUserData,
} from "../redux/slice/userSlice";

let token = localStorage.getItem("token");

export const getCurrentUser = async () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) return;
      const result = await axios.get(`${serverUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUserData(result.data));
    };

    fetchCurrentUser();
  }, []);
};

export const getMyProfile = async () => {
  let dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMyProfile = async () => {
      if (!userData || userData.role !== "user") return;
      if (!token) return;
      const result = await axios.get(`${serverUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setMyProfile(result.data));
    };
    fetchMyProfile();
  }, []);
};

export const getMyAddress = async () => {
  let dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchMyAddress = async () => {
      if (!userData || userData.role !== "user") return;
      if (!token) return;
      const result = await axios.get(`${serverUrl}/users/address/my/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setAddress(result.data));
    };

    fetchMyAddress();
  }, []);
};

export const getNotifications = async () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!token) return;
        const result = await axios.get(
          `${serverUrl}/notifications/my-notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("This is notifications", result.data);
        dispatch(setNotifications(result.data));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);
};

export const getNotificationsCount = async () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchNotificationsCount = async () => {
      if (!token) return;
      let result = await axios.get(`${serverUrl}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCount(result.data));
    };

    fetchNotificationsCount();
  }, []);
};
