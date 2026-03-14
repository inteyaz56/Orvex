import { Flame, Star, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PiHamburgerLight } from "react-icons/pi";

const Burger = () => {
  let { menus } = useSelector((state) => state.resturant);

  const biryaniMenus = menus
    .filter((menu) => menu.name.toLowerCase().includes("burger"))
    .slice(0, 4);

  const navigate = useNavigate();
  return (
    <div className="lg:px-8 lg:py-6 p-2 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <PiHamburgerLight className="text-orange-500" size={22} />
          Burger
        </h2>
      </div>

      {/* Horizontal Scroll */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-6">
        {biryaniMenus?.map((item) => (
          <div
            key={item._id}
            onClick={() => {
              navigate(`/item/details/${item._id}`);
            }}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative ">
              <img
                src={item?.image}
                alt={item?.name}
                className="h-40 w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="px-3 mt-1.5">
              <h3 className="font-semibold text-gray-800 text-sm lg:text-base">
                {item?.name}
              </h3>

              <div className="flex justify-between items-center mt-1.5">
                <span className="text-orange-600 font-bold text-sm lg:text-lg">
                  ₹{item?.price}
                </span>

                <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white  rounded-full shadow-md transition">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Burger;
