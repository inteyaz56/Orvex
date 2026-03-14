import { useDispatch } from "react-redux";
import { serverUrl } from "../main";
import axios from "axios";
import { useEffect } from "react";
import {
  setCategories,
  setMenu,
  setMenus,
  setProfile,
} from "../redux/slice/resturantSlice";

let token = localStorage.getItem("token");

export const getProfile = async () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchMyProfile = async () => {
      if (!token) return;
      const result = await axios.get(`${serverUrl}/resturants/my/resturant`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setProfile(result.data));
    };
    fetchMyProfile();
  }, []);
};

export const getCategories = async () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchCategory = async () => {
      if (!token) return;
      let result = await axios.get(
        `${serverUrl}/resturants/category/my/category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setCategories(result.data));
    };

    fetchCategory();
  }, []);
};

export const getMenu = async () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchMenu = async () => {
      let result = await axios.get(`${serverUrl}/resturants/menu/my/menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setMenu(result.data));
    };

    fetchMenu();
  }, []);
};

export const getAllMenu = async () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchMenu = async () => {
      const result = await axios.get(`${serverUrl}/resturants/menu/menu`);

      dispatch(setMenus(result.data));
    };

    fetchMenu();
  }, []);
};
