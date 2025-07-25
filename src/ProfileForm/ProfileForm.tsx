import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

interface ProfileInputs {
  fullName: string;
  dob: moment.Moment | null;
  experience: number | null;
  position: string;
  login: string;
  password?: string;
  email: string;
  phone?: string;
  notes?: string;
}

const initialValues: ProfileInputs = {
  fullName: 'Фамилия Имя Отчество',
  dob: moment('2000-01-01'),
  experience: 10,
  position: 'Директор',
  login: 'Логин',
  password: '',
  email: 'mail@mail.ru',
  phone: '7900000000',
  notes: 'Информация обо мне'
};

const professions = [
  { value: 'Директор', label: 'Директор' },
  { value: 'Менеджер по работе с клиентами', label: 'Менеджер по работе с клиентами' },
  { value: 'Специалист технической поддержки', label: 'Специалист технической поддержки' },
]

export const ProfileForm: React.FC = () => {
  const [form] = Form.useForm<ProfileInputs>();
  const values = Form.useWatch([], form);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [profile, seProfile] = useState<ProfileInputs>();

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    form.setFieldsValue(initialValues);
    setIsEditing(false);
  };

  const onFinish = (data: ProfileInputs) => {
    if (form.isFieldsTouched() && submittable) {
      seProfile(data)
      setIsEditing(false);
      console.log('Success:', data);
      message.success('Изменения сохранены');
    };
  };

    // TODO any
    const onFinishFailed = (e: any) => {
      console.log(e);
    }

    const validateExperience = (value: number | undefined) => {
      const dob = form.getFieldValue('dob');
      if (dob) {
        const age = moment().diff(dob, 'years');
        if (!!value && value > age) {
          return Promise.reject(new Error('Стаж не может быть больше возраста.'));
        }
      }
      return Promise.resolve();
    };

    return (
      <>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={initialValues}
          autoComplete="off"
        >
          <Form.Item
            name="fullName"
            label="ФИО"
            rules={[{
              required: true,
              max: 100,
              message: 'Введите ФИО (максимум 100 символов).'
            }]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Дата рождения"
            rules={[{
              required: true,
              message: 'Выберите дату рождения.'
            }]}
          >
            <DatePicker disabled={!isEditing} />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Стаж (лет)"
            rules={[{ validator: (_, value) => validateExperience(value) }]}
          >
            <Input type="number" disabled={!isEditing} />
          </Form.Item>
          <Form.Item
            name="position"
            label="Должность"
            rules={[{
              required: true,
              message: 'Выберите должность.'
            }]}
          >
            <Select disabled={!isEditing}>
              {professions.map((profession) => (
                <Option
                  value={profession.value}
                  key={profession.value}>
                  {profession.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="login"
            label="Логин"
            rules={[{
              required: true,
              min: 3,
              max: 20,
              message: 'Логин должен быть от 3 до 20 символов.'
            }
            ]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{
              min: 6,
              max: 12,
              message: 'Пароль должен быть от 6 до 12 символов.'
            }]}
          >
            <Input.Password disabled={!isEditing} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{
              required: true,
              type: 'email',
              message: 'Некорректный email!'
            }
            ]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Номер телефона"
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Примечание"
            rules={[{
              max: 400,
              message: 'Максимум 400 символов.'
            }]}
          >
            <Input.TextArea disabled={!isEditing} maxLength={400} />
          </Form.Item>
          {isEditing && (
            <>
              <Button type="primary" htmlType="submit" disabled={!submittable}>
                Сохранить
              </Button>
              <Button type="primary" onClick={handleCancel} style={{ marginLeft: '8px' }}>
                Отмена
              </Button>
            </>
          )}
        </Form>
        {!isEditing && (
          <Button type="primary" onClick={handleEdit}>
            Изменить
          </Button>
        )}
      </>
    );
  };
