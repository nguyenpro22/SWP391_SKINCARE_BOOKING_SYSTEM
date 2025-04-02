import React from 'react';
import { Form, Select } from 'antd';
import { BOOKING_TYPE_LABELS, BOOKING_TYPES } from '../../utils/constants';

const { Option } = Select;

export const BookingTypeSelect = ({ onChange }) => {
  return (
    <Form.Item
      label="Booking Type"
      name="bookingType"
      rules={[{ required: true, message: 'Please select a booking type' }]}
    >
      <Select onChange={onChange}>
        <Option value={BOOKING_TYPES.SINGLE_SLOT}>
          {BOOKING_TYPE_LABELS[BOOKING_TYPES.SINGLE_SLOT]}
        </Option>
        <Option value={BOOKING_TYPES.MULTI_SLOT}>
          {BOOKING_TYPE_LABELS[BOOKING_TYPES.MULTI_SLOT]}
        </Option>
      </Select>
    </Form.Item>
  );
};

export default BookingTypeSelect;