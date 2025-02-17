import React, { useEffect } from "react";
import { FaCalendarAlt, FaHistory, FaInfo, FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { toast } from "react-toastify";
import { ROLE_MANAGER } from "./constants";

export function formatDateTimeVN(isoString) {
  const date = new Date(isoString);

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  };

  const formatter = new Intl.DateTimeFormat("vi-VN", options);
  const formattedParts = formatter.formatToParts(date);

  const time = `${formattedParts.find((p) => p.type === "hour").value}:${
    formattedParts.find((p) => p.type === "minute").value
  }`;

  const dateStr = `${formattedParts.find((p) => p.type === "day").value}/${
    formattedParts.find((p) => p.type === "month").value
  }/${formattedParts.find((p) => p.type === "year").value}`;

  return `${time} | ${dateStr}`;
}

export const sliderMenu = [
  {
    key: "dashboard",
    icon: <AiOutlineDashboard />,
    label: "Dashboard",
    roles: [ROLE_MANAGER],
  },
  // {
  //   key: "manage-user",
  //   icon: <BiSolidUserAccount />,
  //   label: "Người dùng",
  //   roles: [ROLE_MANAGER],
  // },
  // {
  //   key: "manage-room",
  //   icon: <FaHotel />,
  //   label: "Phòng trọ",
  //   roles: [ROLE_MANAGER],
  // },
  // {
  //   key: "manage-transaction",
  //   icon: <MdOutlineRequestPage />,
  //   label: "Giao dịch",
  //   roles: [ROLE_MANAGER],
  // },
];

export const filterMenuByRole = (menu, role) => {
  if (!role) return [];
  return menu.filter((item) => item.roles.some((r) => r.name === role.name));
};

export const customer_sidebar_list = [
  {
    section: "Account information",
    icon: <FaUser />,
    isDropdown: true,
    children: [
      { label: "Profile", path: "/account", icon: <FaInfo /> },
      {
        label: "Change password",
        path: "/account/change-password",
        icon: <MdOutlinePassword />,
      },
    ],
  },
  {
    label: "History of Skin Care",
    path: "/account-history",
    icon: <FaHistory />,
  },
  {
    label: "Schedule Booked",
    path: "/account-schedule",
    icon: <FaCalendarAlt />,
  },
];

export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
}

export const handleActionNotSupport = () => {
  toast.warning("Tính năng chưa hỗ trợ");
};

export const handleLowerCaseNonAccentVietnamese = (str) => {
  str = str.toLowerCase();

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
};

export const generateFallbackAvatar = (fullname) => {
  const fallbackColor = "#FF9966";

  const initials = handleLowerCaseNonAccentVietnamese(
    fullname?.charAt(0).toUpperCase() || ""
  );

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
      <rect width="100%" height="100%" fill="${fallbackColor}" />
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="50">
        ${initials}
      </text>
    </svg>
  `;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  return dataUrl;
};

export const toastError = (error) => {
  const messages = error?.response?.data?.message;

  if (Array.isArray(messages)) {
    const combinedMessage = messages.join("\n");
    toast.error(combinedMessage);
  } else {
    toast.error(messages || error.message || "An error occurred");
  }
};
