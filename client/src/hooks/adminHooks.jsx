import { useDispatch } from "react-redux";
import { serverUrl } from "../main";
import axios from "axios";
import { useEffect } from "react";
import {
  setPendingResturant,
  setPendingRider,
  setResturant,
  setRider,
} from "../redux/slice/adminSlice";

let token = localStorage.getItem("token");

export const getApproveResturant = async () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchResturant = async () => {
      let result = await axios.get(`${serverUrl}/resturants/all`);
      dispatch(setResturant(result.data));
    };

    fetchResturant();
  }, []);
};

export const getPendingResturant = async () => {
  let dispatch = useDispatch();

  useEffect(() => {
    const fetchpendingResturant = async () => {
      if (!token) return;
      let result = await axios.get(
        `${serverUrl}/resturants/pending/resturants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setPendingResturant(result.data));
    };

    fetchpendingResturant();
  }, []);
};

export const getApprovedRider = async () => {
  let dispatch = useDispatch();

  useEffect(() => {
    const fetchRider = async () => {
      if (!token) return;
      let result = await axios.get(`${serverUrl}/riders/all/riders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setRider(result.data));
    };

    fetchRider();
  }, []);
};

export const getPendingdRider = async () => {
  let dispatch = useDispatch();

  useEffect(() => {
    const fetchRider = async () => {
      if (!token) return;
      let result = await axios.get(`${serverUrl}/riders/pending/riders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setPendingRider(result.data));
    };

    fetchRider();
  }, []);
};
