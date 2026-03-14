import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import axios from "axios";
import { useEffect } from "react";
import { setOrders, setProfile } from "../redux/slice/riderSlice";

let token = localStorage.getItem("token");

export const getProfile = async () => {
  let dispatch = useDispatch();

  useEffect(() => {
    let fetchProfile = async () => {
      let result = await axios.get(`${serverUrl}/riders/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setProfile(result.data));
    };

    fetchProfile();
  }, []);
};

export const getRiderOrders = async () => {
  let dispatch = useDispatch();

  let fetchMyOrders = async () => {
    let result = await axios.get(`${serverUrl}/riders/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("This is rider orders", result.data);

    dispatch(setOrders(result.data));
  };

  fetchMyOrders();
};
