import {useState } from "react";
import { Modal, Input, notification, } from "antd";
interface IProps {
    isCreateModalOpen: boolean,
    access_token: string,
    setIsCreateModalOpen: any,
    getData: any
}
const CreateUserModal = (props: IProps) => {
    const {access_token, isCreateModalOpen, setIsCreateModalOpen, getData} = props;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setAddress("");
        setGender("");
        setRole("")
    }
    const handleOk = async () => {
        const payloadUser = {
          name, email, password, gender, role, address, age
        }
        const response = await fetch("http://localhost:8000/api/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(payloadUser)
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
        <Modal title="Add new user" open={isCreateModalOpen} onOk={handleOk} onCancel={() => { handleCloseCreateModal() }}>
        <div>
          <label>Name</label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>
        <div>
          <label>Email</label>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <div>
          <label>Password</label>
          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <div>
          <label>Address</label>
          <Input
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
            }}
          />
        </div>
        <div>
          <label>Age</label>
          <Input
            value={age}
            onChange={(e) => {
              setAge(e.target.value)
            }}
          />
        </div>
        <div>
          <label>Gender</label>
          <Input
            value={gender}
            onChange={(e) => {
              setGender(e.target.value)
            }}
          />
        </div>
        <div>
          <label>Role</label>
          <Input
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
            }}
          />
        </div>
      </Modal>
    )
}
export default CreateUserModal;