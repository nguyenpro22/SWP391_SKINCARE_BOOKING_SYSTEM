import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

export const ServiceSelect = ({ services, loading }) => {
  return (
    <Form.Item
      label="Select Services"
      name="services"
      rules={[{ required: true, message: 'Please select a service' }]}
    >
      <Select
        loading={loading}
        placeholder="Select a service"
      >
        {services.map((service, index) => (
          <Option key={index} value={service.id}>
            {service.name} - {service.price.toLocaleString()} {service.moneyUnit}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default ServiceSelect;