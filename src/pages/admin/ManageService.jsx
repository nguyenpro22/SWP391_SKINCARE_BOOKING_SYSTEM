import React, { useEffect, useState } from "react";
import {
  Spin,
  Table,
  Button,
  Menu,
  Dropdown,
  Input,
  Select,
  Typography,
  Tag,
  InputNumber,
  DatePicker,
  Modal,
  message
} from "antd";
import { IoIosMore } from "react-icons/io";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selector";
import { getAllServices, updateService, deleteService } from "../../services/service.services";
import ServiceDetailModal from "../../components/manage/ServiceDetailModal";
import CreateNewService from "../../components/manage/CreateNewService";
import EditServiceModal from "../../components/manage/EditServiceModal";

const { Option } = Select;
const { Text } = Typography;
const { confirm } = Modal;

const ManageService = () => {
  const userData = useSelector(userSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [serviceData, setServiceData] = useState([]);

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [serviceName, setServiceName] = useState("");
  const [fromPrice, setFromPrice] = useState(null);
  const [fromDuration, setFromDuration] = useState(null);
  const [fromCreatedDate, setFromCreatedDate] = useState(null);

  const [orderBy, setOrderBy] = useState("");
  const [isAscending, setIsAscending] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchServices = async () => {
    if (userData) {
      setIsLoading(true);
      try {
        const params = {
          Name: serviceName || null,
          FromPrice: fromPrice,
          FromDuration: fromDuration,
          FromCreatedDate: fromCreatedDate ? fromCreatedDate.toISOString() : null,
          OrderBy: orderBy,
          IsAscending: isAscending,
          PageIndex: pageIndex - 1,
          PageSize: pageSize,
        };

        const responseGetAllServices = await getAllServices(params);
        setServiceData([...responseGetAllServices.data]);
        setTotalRows(responseGetAllServices.totalRows);
      } catch (error) {
        toast.error("There was an error loading services!");
        toast.error(error.response?.data?.message);
        console.error("Error loading services:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchServices();
  }, [
    serviceName,
    fromPrice,
    fromDuration,
    fromCreatedDate,
    orderBy,
    isAscending,
    pageIndex,
    pageSize,
    userData
  ]);

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  const handleViewDetails = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsDetailModalVisible(true);
  };

  const handleEditService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsEditModalVisible(true);
  };

  const handleDeleteService = (serviceId) => {
    confirm({
      title: 'Are you sure you want to delete this service?',
      content: 'This action cannot be undone.',
      okText: 'Confirm',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setIsLoading(true);
        try {
          await deleteService(serviceId);
          toast.success("Service deleted successfully!");
          fetchServices();
        } catch (error) {
          toast.error("Failed to delete service!");
          toast.error(error.response?.data?.message);
          console.error("Error deleting service:", error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleServiceUpdated = (updatedService) => {
    setServiceData(prevData => 
      prevData.map(service => 
        service.id === updatedService.id ? updatedService : service
      )
    );
    setIsEditModalVisible(false);
  };

  const handleCloseDetailModal = () => {
    setSelectedServiceId(null);
    setIsDetailModalVisible(false);
  };

  const handleCloseEditModal = () => {
    setSelectedServiceId(null);
    setIsEditModalVisible(false);
  };

  const renderTags = (items) => {
    if (!items || items.length === 0) return <span>-</span>;

    return (
      <div className="flex flex-wrap gap-1">
        {items.map(item => (
          <Tag key={item.id} color="blue">{item.name}</Tag>
        ))}
      </div>
    );
  };

  const handleServiceCreated = async () => {
    fetchServices();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Duration",
      key: "duration",
      sorter: true,
      render: (_, record) => `${record?.duration} ${record.durationUnit}`,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price, record) => `${price?.toLocaleString()} ${record.moneyUnit}`,
    },
    {
      title: "Skin Types",
      dataIndex: "skinTypes",
      key: "skinTypes",
      render: (skinTypes) => renderTags(skinTypes),
    },
    {
      title: "Skin Issues",
      dataIndex: "skinIssues",
      key: "skinIssues",
      render: (skinIssues) => renderTags(skinIssues),
    },
    {
      title: "Types",
      dataIndex: "types",
      key: "types",
      render: (types) => renderTags(types),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view">
              <Button
                type="link"
                onClick={() => handleViewDetails(record.id)}
                className="flex items-center"
              >
                View Details
              </Button>
            </Menu.Item>
            <Menu.Item key="edit">
              <Button
                type="link"
                onClick={() => handleEditService(record.id)}
                className="flex items-center"
              >
                Edit Service
              </Button>
            </Menu.Item>
            <Menu.Item key="delete">
              <Button
                type="link"
                danger
                onClick={() => handleDeleteService(record.id)}
                className="flex items-center"
              >
                Delete Service
              </Button>
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              type="link"
              icon={<IoIosMore style={{ fontSize: "24px" }} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="my-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <Text strong className="mr-2 w-35">Service Name:</Text>
          <Input
            placeholder="Search by name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-48 mr-4"
          />
        </div>

        <div className="flex items-center">
          <Text strong className="mr-2">Price Range:</Text>
          <InputNumber
            placeholder="From"
            value={fromPrice}
            onChange={(value) => setFromPrice(value)}
            className="w-24 mr-2"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
          />
        </div>

        <div className="flex items-center">
          <Text strong className="mr-2">Duration Range:</Text>
          <InputNumber
            placeholder="Duration"
            value={fromDuration}
            onChange={(value) => setFromDuration(value)}
            className="w-24 mr-2"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
          />
        </div>

        <div className="flex items-center">
          <Text strong className="mr-2">Created From:</Text>
          <DatePicker
            value={fromCreatedDate}
            onChange={(date) => setFromCreatedDate(date)}
            className="w-32 mr-4"
          />
        </div>

        <div className="flex items-center">
          <Text strong className="mr-2">Sort By:</Text>
          <Select
            value={orderBy}
            onChange={(value) => setOrderBy(value)}
            className="w-36 mr-2"
          >
            <Option value="">Default</Option>
            <Option value="name">Name</Option>
            <Option value="price">Price</Option>
            <Option value="duration">Duration</Option>
          </Select>
          <Select
            value={isAscending.toString()}
            onChange={(value) => setIsAscending(value === "true")}
            className="w-36"
          >
            <Option value="true">Ascending</Option>
            <Option value="false">Descending</Option>
          </Select>
        </div>

        <CreateNewService onServiceCreated={handleServiceCreated} />
      </div>

      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={serviceData}
          pagination={{
            current: pageIndex,
            pageSize: pageSize,
            total: totalRows,
            onChange: handlePageChange,
          }}
        />
      </Spin>

      {isDetailModalVisible && <ServiceDetailModal
        serviceId={selectedServiceId}
        visible={isDetailModalVisible}
        onClose={handleCloseDetailModal}
      />}

      {isEditModalVisible && <EditServiceModal
        serviceId={selectedServiceId}
        visible={isEditModalVisible}
        onClose={handleCloseEditModal}
        onServiceUpdated={handleServiceUpdated}
      />}

    </div>
  );
};

export default ManageService;