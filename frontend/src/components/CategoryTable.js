import React, { Component } from 'react';
import { Table, Button, Popconfirm, Form  } from 'antd';
import "../style.css";
import { EditableContext } from "./EditableContext";
import ProductsTable from './ProductsTable';
import EditableTableCell from './EditableTableCell';
import { API_LINK } from '../API';

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
    fetchNewData = () => {
        fetch(API_LINK + "categories")
            .then(response => response.json())
            .then(response => {
                let mapped = response.map(e => {
                    e.key = e.CategoryId;
                    e.Products = e.Products.map(e2 => {
                        e2.key = e2.ProductId;
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
                title: 'CategoryId',
                dataIndex: 'CategoryId',
                width: '20%',
            },
            {
                title: 'Name',
                dataIndex: 'Name',
                editable: true,
            },
            {
                title: 'Description',
                dataIndex: 'Description',
                editable: true,
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

    handleDelete = record => {
        fetch(API_LINK + "categories/" + record.CategoryId,
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
        fetch(API_LINK + "categories/",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: 'New category',
                Description: "New category"
            })
        })
        .then(response => {
            if (response.status === 204) {
                this.fetchNewData();
            }
        })
    };

    handleSave = (oldRow, newValues, newRow) => {
        var data = {
            Name: newRow.Name,
            Description: newRow.Description
        }
        fetch(API_LINK + "categories/" + newRow.CategoryId,
            {
                method: "put",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Table
                    expandedRowRender={(record, index) => { return (<ProductsTable data={record.Products} categoryId={record.CategoryId} onUpdate={this.fetchNewData}/>) }}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Add new category
                </Button>
            </div>
        );
    }
}

export default class CategoryTable extends Component {
    render() {
        return <EditableTable />
    }
}