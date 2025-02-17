import React, { useState } from "react";
import "./auth.styles.scss";
import ThirdServicesLogin from "./ThirdServicesLogin";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  getCurrentUserThunk,
  registerThunk,
} from "../../redux/actions/userThunk";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selector";
import { Spin } from "antd";

const RegisterModal = ({ setIsLoginModal, triggerCancel }) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.warning("Nhập lại mật khẩu sai");
      return;
    }

    const data = {
      email: formData.email,
      password: formData.password,
      fullname: formData.name,
      phone_number: formData.phone,
    };

    setIsLoading(true);

    try {
      const action = await dispatch(registerThunk(data));
      if (registerThunk.rejected.match(action)) {
        toast.error(action.payload || action.error.message);
      } else {
        const getCurrentUserAction = await dispatch(getCurrentUserThunk());
        if (getCurrentUserThunk.rejected.match(getCurrentUserAction)) {
          toast.error(action.payload || action.error.message);
        } else {
          setFormData({
            name: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          triggerCancel();
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
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
          REGISTER NEW ACCOUNT
        </h2>
        <form>
          <div className="mb-4">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Fullname"
              type="text"
              style={{ borderColor: "#E4E4E7" }}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Phone number"
              type="text"
              style={{ borderColor: "#E4E4E7" }}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Email"
              type="text"
              style={{ borderColor: "#E4E4E7" }}
              value={formData.email}
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
              value={formData.password}
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

          <div className="mb-4 relative">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              style={{ borderColor: "#E4E4E7" }}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div className="mb-2 mt-10">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              className={`cursor-pointer w-full bg-blue-800 text-white py-4 font-semibold hover:bg-blue-900 disabled:bg-gray-400 ${
                isLoading ? "disabled:cursor-wait" : ""
              } `}
              disabled={isLoading}
            >
              <Spin spinning={isLoading} />
              Sign up
            </button>
          </div>

          <div className="text-center mb-4 flex justify-center">
            <p>Already have an account? </p>

            <button
              className="cursor-pointer hover:underline font-semibold ml-2"
              onClick={() => setIsLoginModal(true)}
              style={{ color: "#618BC9" }}
            >
              Login
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

export default RegisterModal;
