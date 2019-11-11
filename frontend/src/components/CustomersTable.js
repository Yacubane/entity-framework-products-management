import React, { Component } from 'react';
import { Modal } from 'antd';
import "../style.css";
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import { EditableContext } from "./EditableContext";
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
        fetch(API_LINK + "customers")
            .then(response => response.json())
            .then(response => {
                let mapped = response.map(e => {
                    e.key = e.CustomerName;
                    return e;
                })
                this.setState({
                    dataSource: mapped
                })
            });
    }

    constructor(props) {
        super(props);

        this.fetchNewData();

        this.columns = [
            {
                title: 'Company Name',
                dataIndex: 'CompanyName',
                width: '15%',
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

    onChange = (e) => {
        this.setState({ newCompanyName: e.target.value })
    }

    showModal = () => {
        this.setState({
            newCompanyDialogVisible: true,
        });
    };

    dismissModal = () => {
        this.setState({
            newCompanyDialogVisible: false,
        });
    };

    handleDelete = record => {
        fetch(API_LINK + "customers/" + record.CompanyName,
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
            newCompanyDialogVisible: false,
        });
        fetch(API_LINK + "customers/",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CompanyName: this.state.newCompanyName,
                    Description: "New Company Description"
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
            CompanyName: newRow.CompanyName,
            Description: newRow.Description
        }
        fetch(API_LINK + "customers/" + oldRow.CompanyName,
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
                <Modal
                    title="Add new company"
                    visible={this.state.newCompanyDialogVisible}
                    onOk={this.handleAdd}
                    onCancel={this.dismissModal}
                >
                    <Input
                        placeholder="Company name"
                        size="large"
                        value={this.state.newCompanyName || ''}
                        onChange={this.onChange}
                    />
                </Modal>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
                <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }}>
                    Add new customer
                </Button>
            </div>
        );
    }
}

export default class CustomerTable extends Component {
    render() {
        return <EditableTable />
    }
}