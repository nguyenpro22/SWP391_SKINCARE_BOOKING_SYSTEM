import React, { useState, useEffect } from "react";
import "./auth.styles.scss";
import ThirdServicesLogin from "./ThirdServicesLogin";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { loginThunk } from "../../redux/actions/userThunk";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userSelector } from "../../redux/selectors/selector";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { ROLE_MANAGER, ROLE_CUSTOMER, ROLE_STAFF } from "../../utils/constants";
import { updateUser } from "../../redux/reducers/userReducer";
import { getFirebaseDeviceToken } from "../../services/firebase.services";
import { toastError } from "../../utils/helpers";

const LoginModal = ({ setIsLoginModal, triggerCancel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(userSelector);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    deviceToken: "",
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please enter full email and password!");
      return;
    }

    setIsLoading(true);

    // if (!formData.deviceToken) {
    //   const token = await getFirebaseDeviceToken();
    //   console.log("device token: ",)
    //   if (token) {
    //     setFormData(prevData => ({
    //       ...prevData,
    //       deviceToken: token
    //     }));
    //   }
    // }

    try {
      const response = await dispatch(loginThunk(formData));

      if (loginThunk.rejected.match(response)) {
        console.log("loginThunk: ", response)
        toast.error(response.payload.message);
      } else {
        const roleName = response?.payload?.account?.roleName;

        setFormData({
          email: "",
          password: "",
        });
        triggerCancel();

        switch (roleName) {
          case ROLE_MANAGER:
            navigate("/dashboard");
            break;
          case ROLE_STAFF:
            navigate("/manage-bookings");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="px-6 w-full">
        <div className="flex justify-end">
          <button className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <h2 className="text-center text-2xl font-bold text-blue-800 mb-6">
          Login
        </h2>
        <form>
          <div className="mb-4">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Email"
              type="text"
              style={{ borderColor: "#E4E4E7" }}
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="mb-4 relative">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              style={{ borderColor: "#E4E4E7" }}
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div className="flex justify-end cursor-pointer">
            <p
              className="hover:underline"
              onClick={() => {
                // navigate("/forgot-password");
                triggerCancel();
              }}
            >
              Forgot password?
            </p>
          </div>

          <div className="mb-2 mt-5">
            <button
              className={`cursor-pointer w-full bg-blue-800 text-white py-4 font-semibold hover:bg-blue-900 disabled:bg-gray-400 ${isLoading ? "disabled:cursor-wait" : ""
                }`}
              disabled={isLoading}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <Spin spinning={isLoading} />
              Login
            </button>
          </div>

          <div className="text-center mb-4">
            <button
              className="cursor-pointer hover:underline font-semibold"
              onClick={() => setIsLoginModal(false)}
              style={{ color: "#618BC9" }}
            >
              Register new account
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <div className="px-2 text-gray-500 " style={{ color: "#A0A1A4" }}>
            Continue with
          </div>
          <hr className="flex-grow border-gray-300" />
        </div>

        <ThirdServicesLogin
          triggerCancel={triggerCancel}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default LoginModal;
