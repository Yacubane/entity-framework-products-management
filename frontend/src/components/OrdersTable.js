import React, { Component } from 'react';
import { Modal, Select } from 'antd';
import "../style.css";
import { Table, Button, Popconfirm, Form } from 'antd';
import { EditableContext } from "./EditableContext";
import EditableTableCell from './EditableTableCell';
import OrderItemsTable from './OrderItemsTable';
import { API_LINK } from '../API';

const { Option } = Select;


const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
    fetchNewData = () => {
        fetch(API_LINK + "orders")
            .then(response => response.json())
            .then(response => {
                let mapped = response.map(e => {
                    e.key = e.OrderId;
                    e.OrderItems = e.OrderItems.map(e2 => {
                        e2.ProductName = e2.Product.Name;
                        e2.key = e2.OrderItemId;
                        return e2;
                    })
                    return e;
                })
                this.setState({
                    dataSource: mapped
                })
                console.log(mapped);
            });
    }

    constructor(props) {
        super(props);

        this.fetchNewData();

        this.columns = [
            {
                title: 'OrderId',
                dataIndex: 'OrderId',
                width: '20%',
            },
            {
                title: 'Company Name',
                dataIndex: 'CompanyName',
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];

        this.state = {
            dataSource: [],
            count: 0,
        };
    }


showModal = () => {
    fetch(API_LINK + "customers")
        .then(response => response.json())
        .then(response => {
            this.setState({
                customers: response,
                newOrderDialogVisible: true,
            })
        });
};

dismissModal = () => {
    this.setState({
        newOrderDialogVisible: false,
    });
};

handleNewOrderCompanyNameSelection = (value) => {
    this.setState({
        newOrderCompanyName: value
    })
}

handleDelete = record => {
    fetch(API_LINK + "orders/" + record.OrderId,
        {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 204) {
                this.fetchNewData();
            }
        })
};

handleAdd = () => {
    this.setState({
        newOrderDialogVisible: false,
    });
    fetch(API_LINK + "orders/",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CompanyName: this.state.newOrderCompanyName,
            })
        })
        .then(response => {
            if (response.status === 204) {
                this.fetchNewData();
            }
        })
};

render() {
    const { dataSource } = this.state;
    const components = {
        body: {
            row: EditableFormRow,
            cell: EditableTableCell,
        },
    };
    const columns = this.columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: () => { },
            }),
        };
    });
    return (
        <div>
            <Modal
                title="Add new order"
                visible={this.state.newOrderDialogVisible}
                onOk={this.handleAdd}
                onCancel={this.dismissModal}
            >

                <Select defaultValue="Choose company" style={{ width: "100%" }} onChange={this.handleNewOrderCompanyNameSelection}>
                    {this.state.customers != null && this.state.customers.map((data) => {
                        return <Option value={data.CompanyName}>
                            {data.CompanyName}
                        </Option>
                    })}
                </Select>


            </Modal>
            <Table
                expandedRowRender={(record, index) => { return (<OrderItemsTable data={record.OrderItems} orderId={record.OrderId} onUpdate={this.fetchNewData} />) }}
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
            <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }}>
                Add new order
                </Button>
        </div>
    );
}
}

export default class OrdersTable extends Component {
    render() {
        return <EditableTable />
    }
}