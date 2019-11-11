import React, { Component } from 'react';
import "../style.css";
import { Table, Button, Popconfirm, Form } from 'antd';
import { EditableContext } from "./EditableContext";
import EditableTableCell from './EditableTableCell';
import { API_LINK } from '../API';

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export default class ProductsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'ProductId',
                dataIndex: 'ProductId',
                width: '20%',
            },
            {
                title: 'Name',
                dataIndex: 'Name',
                editable: true,
            },
            {
                title: 'Units in stock',
                dataIndex: 'UnitsInStock',
                editable: true,
            },
            {
                title: 'Unit price',
                dataIndex: 'Unitprice',
                editable: true,
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
    }

    handleDelete = record => {
        fetch(API_LINK + "categories/" + this.props.categoryId + "/products/" + record.ProductId,
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
        fetch(API_LINK + "categories/" + this.props.categoryId + "/products",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: 'New product',
                UnitsInStock: '0',
                Unitprice: '0',
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
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={this.props.data}
                    columns={columns}
                />
                <Button onClick={this.handleAdd} type="primary" style={{ marginTop: 16 }}>
                    Add new product
                </Button>
            </div>
        );
    }
}