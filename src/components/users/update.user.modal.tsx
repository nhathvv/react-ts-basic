import {useEffect, useState } from "react";
import { Modal, Input, notification, } from "antd";
import { IUsers } from "./users.table";
interface IProps {
    isUpdateModalOpen: boolean,
    access_token: string,
    setIsUpdateModalOpen: any,
    getData: any,
    dataUpdate: IUsers
}
const UpdateUserModal = (props: IProps) => {
    const {access_token, isUpdateModalOpen, setIsUpdateModalOpen, getData, dataUpdate} = props;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
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
          _id: dataUpdate._id,
          name, email, password, gender, role, address, age
        }
        const response = await fetch("http://localhost:8000/api/v1/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(payloadUser)
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
    useEffect(() => {
       if(dataUpdate) {
            setName(dataUpdate.name);
            setEmail(dataUpdate.email);
            setPassword(dataUpdate.password);
            setAge(dataUpdate.age);
            setAddress(dataUpdate.address);
            setGender(dataUpdate.gender);
            setRole(dataUpdate.role)
       }
    },[dataUpdate])
    return (
        <Modal title="Update a user" open={isUpdateModalOpen} onOk={handleOk} onCancel={() => { handleCloseUpdateModal() }}>
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
            disabled={true}
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
export default UpdateUserModal;