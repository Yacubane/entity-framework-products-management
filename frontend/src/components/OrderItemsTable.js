import React, { Component } from 'react';
import { Modal, Select } from 'antd';
import "../style.css";
import { Table, Button, Popconfirm, Form, InputNumber } from 'antd';
import { EditableContext } from "./EditableContext";
import EditableTableCell from './EditableTableCell';
import { API_LINK } from '../API';
const { Option } = Select;

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export default class OrderItemsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Order Item Id',
                dataIndex: 'OrderItemId',
                width: '20%',
            },
            {
                title: 'Product Name',
                dataIndex: 'ProductName',
            },
            {
                title: 'Count',
                dataIndex: 'Count',
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.props.data.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        this.state = {
            newOrderItemDialogVisible: false
        }
    }


    showModal = () => {
        fetch(API_LINK + "products")
            .then(response => response.json())
            .then(response => {
                this.setState({
                    products: response,
                    newOrderItemDialogVisible: true,
                    selectedCount: 1,
                })
            });
    };

    dismissModal = () => {
        this.setState({
            newOrderItemDialogVisible: false,
        });
    };

    handleProductSelection = (value) => {
        this.setState({
            selectedProduct: this.state.products.filter(e => e.ProductId === value)[0],
        })
    }

    handleCountSelection = (value) => {
        this.setState({
            selectedCount: value
        })
    }

    handleDelete = record => {
        fetch(API_LINK + "orders/" + this.props.orderId + "/items/" + record.OrderItemId,
            {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.status === 204) {
                    this.props.onUpdate();
                }
            })
    };

    handleAdd = () => {
        this.setState({
            newOrderItemDialogVisible: false,
        });
        fetch(API_LINK + "orders/" + this.props.orderId + "/items",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ProductId: this.state.selectedProduct.ProductId,
                    Count: this.state.selectedCount,
                })
            })
            .then(response => {
                if (response.status === 204) {
                    this.props.onUpdate();
                }
            })
    };

    handleSave = (oldRow, newValues, newRow) => {
        var data = {
            Name: newRow.Name,
            Unitprice: newRow.Unitprice,
            UnitsInStock: newRow.UnitsInStock
        }
        fetch(API_LINK + "categories/" + this.props.categoryId + "/products/" + newRow.ProductId,
            {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status === 204) {
                    this.props.onUpdate();
                }
            })
    };

    render() {
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
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Modal
                    title="Add new order item"
                    visible={this.state.newOrderItemDialogVisible}
                    onOk={this.handleAdd}
                    onCancel={this.dismissModal}
                >

                    <Select defaultValue="Choose order item" style={{ width: "100%" }} onChange={this.handleProductSelection}>
                        {this.state.products != null && this.state.products.map((data) => {
                            return <Option value={data.ProductId}>
                                {data.Name + " Units: " + data.UnitsInStock}
                            </Option>
                        })}
                    </Select>

                    <div>
                        Count:
                    {this.state.selectedProduct != null &&
                            <InputNumber min={1} max={this.state.selectedProduct.UnitsInStock} defaultValue={1} onChange={this.handleCountSelection} />}
                    </div>


                </Modal>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={this.props.data}
                    columns={columns}
                />
                <Button onClick={this.showModal} type="primary" style={{ marginTop: 16 }}>
                    Add new product
                </Button>
            </div>
        );
    }
}