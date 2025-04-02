import React from 'react';
import { Form, Radio, Space } from 'antd';

export const TimeSlotSelection = ({ timeSlots, loading, onChange, isSlotDisabled }) => {
  return (
    <Form.Item
      label="Available Time Slots"
      name="timeSlot"
      // No longer required
    >
      <Radio.Group
        className="w-full"
        loading={loading ? 'true' : 'false'}
        onChange={(e) => onChange(e.target.value)}
      >
        <Space wrap>
          {timeSlots.map((slot) => (
            <Radio.Button
              key={slot.id}
              value={slot.id}
              className="mb-2"
              disabled={isSlotDisabled(slot)}
            >
              {`Slot ${slot.slotNumber} (${slot.startTime} - ${slot.endTime})`}
            </Radio.Button>
          ))}
        </Space>
      </Radio.Group>
    </Form.Item>
  );
};

export default TimeSlotSelection;