import React, { useState, useEffect, useRef } from 'react';
import { Form, DatePicker, Radio, Input, Button, Typography, Space, Checkbox, Row, Col, Card, Switch } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../../utils/helpers';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/selectors/selector';
import { BOOKING_TYPES } from '../../utils/constants';
import { getAllSlots } from '../../services/workingSchedule.services';
import { getAllServices } from '../../services/service.services';
import { createBookings, getAllSkinTherapistByWorkingDateAndSlotId } from '../../services/booking.services';
import ConfirmationModal from '../../components/schedule/ConfirmationModal';
import ServiceSelect from '../../components/schedule/ServiceSelect';
import BookingTypeSelect from '../../components/schedule/BookingTypeSelect';
import TimeSlotSelection from '../../components/schedule/TimeSlotSelection';
import TherapistSelection from '../../components/schedule/TherapistSelection';

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { TextArea } = Input;

const Schedule = () => {
  useScrollToTop();
  const [form] = Form.useForm();
  const detailsSectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedService = location.state?.service;
  const userData = useSelector(userSelector);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookForSelf, setBookForSelf] = useState(true);
  const [bookingType, setBookingType] = useState(BOOKING_TYPES.SINGLE_SLOT);
  const [therapists, setTherapists] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({
    slots: false,
    services: false,
    therapists: false
  });

  useEffect(() => {
    fetchTimeSlots();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      form.setFieldsValue({
        services: selectedService.id
      });
    }

    if (userData && bookForSelf) {
      form.setFieldsValue({
        fullName: userData?.user?.fullName,
        email: userData?.user?.email,
      });
    }

    if (selectedService) {
      if (detailsSectionRef.current) {
        detailsSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [selectedService, services, form, userData]);

  useEffect(() => {
    if (selectedDate && selectedSlot) {
      fetchTherapistsByDateAndSlot();
    }
  }, [selectedDate, selectedSlot]);

  const handleBookForSelfChange = (checked) => {
    setBookForSelf(checked);

    if (checked && userData) {
      form.setFieldsValue({
        fullName: userData?.user?.fullName,
        email: userData?.user?.email,
      });
    } else {
      form.setFieldsValue({
        fullName: undefined,
        email: undefined,
      });
    }
  };

  const handleBookingTypeChange = (value) => {
    if (value === BOOKING_TYPES.MULTI_SLOT) {
      toast.warning('This function is currently not available.');
      setBookingType(BOOKING_TYPES.SINGLE_SLOT);
      form.setFieldsValue({ bookingType: BOOKING_TYPES.SINGLE_SLOT });
    } else {
      setBookingType(value);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      setLoading(prev => ({ ...prev, slots: true }));
      const response = await getAllSlots();
      setTimeSlots(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch time slots');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, slots: false }));
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }));
      const response = await getAllServices();
      setServices(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch services');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  const fetchTherapistsByDateAndSlot = async () => {
    try {
      setLoading(prev => ({ ...prev, therapists: true }));

      form.setFieldsValue({ therapist: undefined });

      const params = {
        workingDate: selectedDate.format('YYYY-MM-DD'),
        slotId: selectedSlot
      };

      const response = await getAllSkinTherapistByWorkingDateAndSlotId(params);
      setTherapists(response || []);

      if (response && response.length === 0) {
        toast.info('No therapists available for the selected date and time slot');
      }
    } catch (error) {
      console.error('Failed to fetch therapists:', error);
      toast.error('Failed to fetch available therapists');
      setTherapists([]);
    } finally {
      setLoading(prev => ({ ...prev, therapists: false }));
    }
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    form.setFieldsValue({ timeSlot: undefined, therapist: undefined });
    setSelectedSlot(null);
    setTherapists([]);
  };

  const handleTimeSlotChange = (slotId) => {
    setSelectedSlot(slotId);
  };

  const processBooking = async (values, noSlotNoTherapist) => {
    if (!userData?.user) {
      toast.error('Please login before booking');
      return;
    }

    try {
      let bookingData = {
        serviceId: values.services,
        ...(bookForSelf ? {} : {
          patient: {
            fullName: values.fullName,
            gender: values.gender,
            phone: values.phone,
            email: values.email,
          }
        }),
        bookingDate: values.date.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        type: bookingType,
        bookForCustomerAccountOwner: bookForSelf
      };

      if (!noSlotNoTherapist) {
        bookingData.bookingSlotCreateDTO = {
          slotId: values.timeSlot,
          ...(values.therapist ? { skinTherapistId: values.therapist } : {})
        };
      }

      console.log("bookingData: ", bookingData)

      const response = await createBookings(bookingData);

      if (response?.paymentURL) {
        window.location.href = response.paymentURL
      }

      toast.success('Booking successful!');
      navigate('/account-history');

    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const handleSubmit = (values) => {
    if (!values.timeSlot && !values.therapist) {
      ConfirmationModal.show('no-slot-no-therapist', () => processBooking(values, true));
    }
    else if (values.timeSlot && !values.therapist) {
      ConfirmationModal.show('slot-no-therapist', () => processBooking(values, false));
    }
    else {
      processBooking(values, false);
    }
  };

  const isSlotDisabled = (slot) => {
    if (!selectedDate) return false;

    const now = dayjs();
    const selectedMoment = dayjs(selectedDate);

    if (selectedMoment.isSame(now, 'day')) {
      const currentHour = now.hour();
      const currentMinute = now.minute();

      const [slotHour, slotMinute] = slot.startTime.split(':').map(Number);

      if (currentHour > slotHour || (currentHour === slotHour && currentMinute > slotMinute)) {
        return true;
      }

      const slotStartTime = dayjs(selectedDate)
        .hour(slotHour)
        .minute(slotMinute);

      const minutesDiff = slotStartTime.diff(now, 'minute');
      if (minutesDiff < 30) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="bg-gray-50 pb-20">
      <div
        className="banner-services bg-cover bg-center w-full h-[400px] relative"
        style={{
          backgroundImage:
            'url("https://www.vinmec.com/static/uploads/cover_list_doctor_f60bffe168.jpg")',
        }}
      >
        <div
          ref={detailsSectionRef}
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900">
            Appointment Booking
          </h2>
        </div>
      </div>

      <div className="mt-20" />

      <div className="container mx-auto px-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ bookingType: BOOKING_TYPES.SINGLE_SLOT }}
        >
          <Card className="mb-8">
            <Title level={4} className="mb-6" style={{
              borderLeft: '4px solid #1890ff',
              paddingLeft: '12px'
            }}>
              Details of appointment booking
            </Title>

            <Row gutter={24} className='mt-4'>
              <Col xs={24} md={12}>
                <ServiceSelect 
                  services={services} 
                  loading={loading.services} 
                />

                <Form.Item
                  label="Appointment Date"
                  name="date"
                  rules={[{ required: true, message: 'Please select a date' }]}
                >
                  <DatePicker
                    className="w-full"
                    disabledDate={disabledDate}
                    onChange={handleDateChange}
                  />
                </Form.Item>

                <BookingTypeSelect 
                  onChange={handleBookingTypeChange} 
                />
              </Col>

              <Col xs={24} md={12}>
                <TimeSlotSelection 
                  timeSlots={timeSlots}
                  loading={loading.slots}
                  onChange={handleTimeSlotChange}
                  isSlotDisabled={isSlotDisabled}
                />

                <TherapistSelection 
                  therapists={therapists}
                  loading={loading.therapists}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                />
              </Col>
            </Row>
          </Card>

          <Card style={{ marginTop: "40px" }}>
            <Title level={4} className="mb-6" style={{
              borderLeft: '4px solid #1890ff',
              paddingLeft: '12px'
            }}>
              Customer information
            </Title>

            <div className="mb-4 mt-4 flex items-center">
              <Text className="mr-2">Book for myself</Text>
              <Switch
                checked={bookForSelf}
                onChange={handleBookForSelfChange}
              />
            </div>
            {!bookForSelf &&
              (
                <>
                  <Row gutter={24} className='mt-4'>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: 'Please select your gender' }]}
                      >
                        <Radio.Group>
                          <Radio value="male">Male</Radio>
                          <Radio value="female">Female</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Email"
                        name="email"
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Reason for Visit"
                        name="reason"
                        rules={[{ required: true, message: 'Please enter your reason for visit' }]}
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[{ required: true, message: 'Please accept the terms' }]}
                  >
                    <Checkbox>
                      I have read and agree to the privacy policy
                    </Checkbox>
                  </Form.Item>
                </>
              )
            }

            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit" size="large">
                Book Appointment
              </Button>
            </Form.Item>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default Schedule;