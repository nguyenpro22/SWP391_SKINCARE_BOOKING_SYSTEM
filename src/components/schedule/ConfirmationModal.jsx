import React from 'react';
import { Modal } from 'antd';

const getModalContent = (type) => {
  switch (type) {
    case 'no-slot-no-therapist':
      return {
        title: 'Automatic Scheduling Confirmation',
        content: (
          <div>
            <p>Since you have not selected a time slot or skin therapist:</p>
            <ul style={{ marginTop: '10px', marginBottom: '10px' }}>
              <li style={{ marginBottom: '8px' }}>
                - The system will <strong style={{ color: '#1890ff' }}>automatically arrange any available slot</strong> for you
              </li>
              <li>
                - You will be assigned <strong style={{ color: '#1890ff' }}>any available therapist</strong>
              </li>
            </ul>
            <strong>Do you want to continue with automatic scheduling?</strong>
          </div>
        )
      };
    case 'slot-no-therapist':
      return {
        title: 'Automatic Therapist Assignment',
        content: (
          <div>
            <p>Since you have not selected a skin therapist:</p>
            <ul style={{ marginTop: '10px', marginBottom: '10px' }}>
              <li>
                - You will keep your selected time slot, but the system will
                <strong style={{ color: '#1890ff' }}> automatically assign an available therapist</strong> for your appointment
              </li>
            </ul>
            <strong>Do you want to continue with automatic therapist assignment?</strong>
          </div>
        )
      };
    default:
      return {
        title: 'Confirmation',
        content: 'Do you want to proceed?'
      };
  }
};

export const ConfirmationModal = {
  show: (type, onConfirm) => {
    const { title, content } = getModalContent(type);
    
    Modal.confirm({
      title,
      content,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        onConfirm();
      }
    });
  }
};

export default ConfirmationModal;