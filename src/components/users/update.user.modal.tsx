import { useEffect } from "react";
import { Modal, Input, notification, Form, InputNumber, Select, } from "antd";
import { IUsers } from "./users.table";
interface IProps {
  isUpdateModalOpen: boolean,
  access_token: string,
  setIsUpdateModalOpen: any,
  getData: any,
  dataUpdate: IUsers
}
const { Option } = Select
const UpdateUserModal = (props: IProps) => {
  const { access_token, isUpdateModalOpen, setIsUpdateModalOpen, getData, dataUpdate } = props;

  const [form] = Form.useForm();
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    form.resetFields()
  }
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        gender: dataUpdate.gender,
        age: dataUpdate.age,
        address: dataUpdate.address,
        role: dataUpdate.role,
        email: dataUpdate.email,
        password: dataUpdate.password
      })
    }
  }, [dataUpdate])
  const onFinish = async (values: IUsers) => {
    const { name, email, gender, age, address, role, password } = values
    const data = { _id: dataUpdate._id, name, email, gender, age, address, role, password }
    const response = await fetch("http://localhost:8000/api/v1/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(data)
    });
    const d = await response.json();
    if (d.data) {
      notification.success({
        message: "Cập nhật người dùng thành công",
      })
      await getData()
      setIsUpdateModalOpen(false)
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: JSON.stringify(d.message)
      })
    }
  };
  return (
    <Modal title="Update a user" open={isUpdateModalOpen} onOk={() => { form.submit() }} onCancel={() => { handleCloseUpdateModal() }}>
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
          rules={[{ required: dataUpdate ? false : true, message: 'Please input your password!' }]}

        >
          <Input.Password
            disabled={dataUpdate ? true : false}
          />
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
export default UpdateUserModal;