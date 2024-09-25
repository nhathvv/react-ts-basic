import { useState } from "react";
import { Modal, Input, notification, Form, Button, InputNumber, Select, } from "antd";
import { IUsers } from "./users.table";
const { Option } = Select;
interface IProps {
  isCreateModalOpen: boolean,
  access_token: string,
  setIsCreateModalOpen: any,
  getData: any
}
const CreateUserModal = (props: IProps) => {
  const { access_token, isCreateModalOpen, setIsCreateModalOpen, getData } = props;

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields()
  }
  const [form] = Form.useForm();
  const onFinish = async (values: IUsers) => {
    const { name, email, gender, age, address, role, password } = values
    const data = { name, email, gender, age, address, role, password }
    const response = await fetch("http://localhost:8000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(data)
    });
    const d = await response.json();
    console.log(">> check response add new user", d)
    await getData()
    if (d.data) {
      notification.success({
        message: "Tạo user thành công",
      })
      setIsCreateModalOpen(false)
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: JSON.stringify(d.message)
      })
    }
  };

  return (
    <Modal title="Add new user" open={isCreateModalOpen} onOk={() => { form.submit() }} onCancel={() => { handleCloseCreateModal() }}>
      <Form
        name="basic"
        onFinish={onFinish}
        layout="vertical"
        form={form}
      >
        <Form.Item
          style={{ marginBottom: 3 }}
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 3 }}
          name="email"
          label="Email"
          rules={[{ type: 'email', required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 3 }}
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 3 }}
          name='age'
          label="Age"
          rules={[{ type: 'number', min: 0, max: 99, required: true, message: 'Please input your age!' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 3 }}
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 3 }}
          name="gender"
          label="Gender"
          rules={[{ required: true }]}>
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="MALE">male</Option>
            <Option value="FERMALE">female</Option>
            <Option value="OTHER">other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 3 }}
          name="role"
          label="Role"
          rules={[{ required: true }]}>
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="USER">User</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default CreateUserModal;