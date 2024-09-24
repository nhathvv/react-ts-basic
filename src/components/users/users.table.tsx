import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, notification,Pagination} from 'antd';
import type { TableProps , PopconfirmProps} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";

export interface IUsers {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string,
  address:string,
  gender:string,
  age:string,
}
const UserTable = () => {
  const [listUsers, setListUsers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const [dataUpdate, setDataUpdate] = useState<IUsers | null>(null)
  const [meta, setMeta] = useState({
    "current": 1,
    "pageSize": 5,
    "pages": 0,
    "total": 0
  })

  const access_token = localStorage.getItem("access_token") as string

  const confirm: PopconfirmProps['onConfirm'] = async () => {
    const response = await fetch(`http://localhost:8000/api/v1/users/${dataUpdate?._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      }
    })
    const d = await response.json()
    console.log(">>> check response delete", d)
    if(d.data) {
      message.success("Xoá thành công!")
      await getData()
    }else {
      notification.error({
        message: d.message,
    })
    }
  };
  const columns: TableProps<IUsers>['columns'] = [
    {
      title: "Email",
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: "Name",
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: "Role",
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: "Actions",
      render: (_value, record) => {
        return (
          <div>
              <Button onClick={() => {
                setIsUpdateModalOpen(true)
                setDataUpdate({
                  _id: record._id,
                  gender: record.gender,
                  address: record.address,
                  age: record.age,
                  name: record.name,
                  email: record.email,
                  password: record.password,
                  role: record.role
                })
              }}>Edit</Button>
               <Popconfirm
                  title="Delete the task"
                  description={`"Are you sure to delete this user? name = ${record.name}"`}
                  onConfirm={confirm}
                  okText="Yes"
                  cancelText="No"
                >
                <Button danger style={{marginLeft: "7px"}} onClick={() => {
                  setDataUpdate({
                    _id: record._id,
                    gender: record.gender,
                    address: record.address,
                    age: record.age,
                    name: record.name,
                    email: record.email,
                    password: record.password,
                    role: record.role
                  })
                }}>Delete</Button>
                </Popconfirm>
          </div>
        )
      }
    }
  ]
  const getData = async () => {
      const response = await fetch(`http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      const d = await response.json();
      setMeta({
        current: d.data.meta.current,
        pageSize: d.data.meta.pageSize,
        total: d.data.meta.total,
        pages: d.data.meta.pages
      })
      setListUsers(d.data.result);
    };
    useEffect(() => {
      getData();
  }, []);
  const handleOnChange = async (page: number, pageSize: number) => {
    const response = await fetch(`http://localhost:8000/api/v1/users?current=${page}&pageSize=${pageSize}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const d = await response.json();
    setListUsers(d.data.result);
    setMeta({
      current: page,
      pageSize: pageSize,
      total: meta.total,
      pages: meta.pages
    })
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Users</h3>
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsCreateModalOpen(true) }}>
            Add new
          </Button>
        </div>
      </div>
      <Table
        dataSource={listUsers}
        columns={columns}
        rowKey={"_id"}
        pagination={
          {
            current: meta.current,
            pageSize: meta.pageSize,
            total:meta.total,
            onChange: async (page, pageSize) => {
              handleOnChange(page,pageSize)
            },
            showTotal: (total, range) => {
              return `${range[0]}-${range[1]} of ${total} items`
            },
            showSizeChanger:true
          }
        }
      />

      <CreateUserModal 
        access_token={access_token}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        getData={getData}
      />
      <UpdateUserModal 
        access_token={access_token}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        getData={getData}
        dataUpdate={dataUpdate as IUsers}
      />
    </div>
  );
};
export default UserTable;
