import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

export const TherapistSelection = ({ therapists, loading, selectedDate, selectedSlot }) => {
  return (
    <Form.Item
      label="Select Skin Therapist"
      name="therapist"
      // No longer required
    >
      <Select
        loading={loading}
        placeholder={selectedDate && selectedSlot 
          ? "Select a skin therapist" 
          : "Please select date and time slot first"
        }
        disabled={!selectedDate || !selectedSlot}
      >
        {therapists.map(therapist => (
          <Option key={therapist?.id} value={therapist?.id}>
            {therapist?.account?.fullName} - {therapist?.specialization.split(',')[0]}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default TherapistSelection;