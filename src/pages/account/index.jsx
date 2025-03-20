import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selector";
import AccountLayout from "../../components/layout/AccountLayout";
import { Select, Spin } from "antd";
import { generateFallbackAvatar, handleActionNotSupport } from "../../utils/helpers";
import { provideSkinTherapistInfo, updateAccounts } from "../../services/user.services";
import { toast } from "react-toastify";
import { ROLE_SKINTHERAPIST } from "../../utils/constants";

const Account = () => {
  const dispatch = useDispatch();
  const userData = useSelector(userSelector);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: userData?.user?.fullName || "",
    email: userData?.user?.email || "",
    phone: userData?.user?.phone || "",
    address: userData?.user?.address || "",
    avatar_url: userData?.user?.avatar_url || "",
    age: userData?.user?.age || "",
    gender: userData?.user?.gender || "",

    // 
    description: userData?.user?.description || "",
    experience: userData?.user?.experience || "",
    specialization: userData?.user?.specialization || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      if (userData?.user?.roleName === ROLE_SKINTHERAPIST && (
        formData.description !== '' ||
        formData.experience !== '' ||
        formData.specialization !== ''
      )) {
        const skinTherapistData = {
          description: formData.description,
          experience: formData.experience,
          specialization: formData.specialization
        };

        await provideSkinTherapistInfo(skinTherapistData);
      }

      // const updateData = {
      //   fullName: formData.fullName,
      //   age: parseInt(formData.age),
      //   gender: formData.gender,
      //   phone: formData.phone,
      //   address: formData.address
      // };

      // const response = await updateAccounts(updateData);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccountLayout>
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h1 className="text-xl font-medium mb-6">Personal information</h1>
        <p className="text-gray-600 mb-6">
          Manage your profile information to keep your account secure
        </p>

        <div className="horizontal-break"></div>

        <div className="flex mt-10">
          <div className="flex-1 pr-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Full name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  className="col-span-2 p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Email</label>
                <div className="col-span-2 flex items-center">
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full bg-gray-100 text-gray-500 cursor-not-allowed opacity-70"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Phone number</label>
                <div className="col-span-2 flex items-center">
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center mb-4">
                <label className="text-gray-600">Age</label>
                <div className="col-span-2 flex items-center">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full"
                    min="0"
                    max="120"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center mb-4">
                <label className="text-gray-600">Gender</label>
                <div className="col-span-2 flex items-center">
                  <Select
                    style={{ width: '100%', height: "43px" }}
                    placeholder="Select gender"
                    value={formData.gender}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        gender: value,
                      })
                    }
                  >
                    <Select.Option value="MALE">Male</Select.Option>
                    <Select.Option value="FEMALE">Female</Select.Option>
                    <Select.Option value="OTHER">Other</Select.Option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Address</label>
                <div className="col-span-2 flex items-center">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>
              </div>

              {userData?.user?.roleName === ROLE_SKINTHERAPIST && (
                <>
                  <div className="grid grid-cols-3 items-center mt-6">
                    <label className="text-gray-600">Description</label>
                    <div className="col-span-2 flex items-center">
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="p-2 border rounded w-full"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center mt-6">
                    <label className="text-gray-600">Experience</label>
                    <div className="col-span-2 flex items-center">
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                        className="p-2 border rounded w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center mt-6">
                    <label className="text-gray-600">Specialization</label>
                    <div className="col-span-2 flex items-center">
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialization: e.target.value,
                          })
                        }
                        className="p-2 border rounded w-full"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-3 items-center">
                <div className="col-start-2">
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-8 py-2 rounded transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-lg cursor-pointer"
                    style={{ border: "0.5px" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="line-break-account"></div>

          <div className="w-48">
            <div className="text-center">
              <div
                className="w-24 h-24 mx-auto mb-4 cursor-pointer"
                onClick={handleActionNotSupport}
              >
                <img
                  src={
                    userData?.user?.avatar_url ??
                    generateFallbackAvatar(userData?.user?.fullName)
                  }
                  alt="avatar"
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover bg-gray-200 overflow-hidden hover:opacity-80 transition-opacity"
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleActionNotSupport}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              <button
                type="button"
                onClick={handleActionNotSupport}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
              >
                Upload photo
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Maximum size 1 MB
                <br />
                Format: JPEG, PNG
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <Spin />}
    </AccountLayout>
  );
};

export default Account;
