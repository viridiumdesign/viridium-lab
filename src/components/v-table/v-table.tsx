import React from "react";
import { Button, Form, Table } from "react-bootstrap";

import "./v-table.css";

interface FormFieldOption {

}

interface TableFilterProps {
    name: string,
    value?: string,
    options?: Array<FormFieldOption>,
    onChange?: Function
}
interface TableFilterState {
    value: string,
}
export interface Filter {
    name: string,
    value?: string,
    options?: Array<FormFieldOption>,
}
interface FilterProps {
    name: string,
    value?: string,
    options?: Array<FormFieldOption>,
    onChange: Function
}

export class OptionFilter extends React.Component<FilterProps, TableFilterState> {
    onChange = (v: any) => {
        if (this.props.onChange) {
            this.props.onChange(v)
        }
    }
    render() {
        let value = this.props.value;
        let label = this.props.name;
        return (
            <Form.Group controlId={label}>
                <Form.Label>{label}</Form.Label>
                <Form.Select value={value} onInput={this.onChange}>
                    {this.props.options!.map((opt: any, idx: number) => <option key={'opt' + idx} value={opt.value}>{opt.label}</option>)}
                </Form.Select>
            </Form.Group>
        )
    }
}

export class TextFilter extends React.Component<FilterProps, TableFilterState> {
    onChange = (v: any) => {
        if (this.props.onChange) {
            this.props.onChange(v)
        }
    }
    render() {
        let value = this.props.value;
        let label = this.props.name;
        return (
            <Form.Group controlId={label}>
                <Form.Label>{label}</Form.Label>
                <Form.Control placeholder={label} type="text" value={value} onInput={this.onChange} />
            </Form.Group>
        )
    }
}

export class TableFilter extends React.Component<TableFilterProps, TableFilterState> {
    constructor(props: TableFilterProps) {
        super(props);
        this.state = { value: props.value ? props.value : "" };
    }
    onChange = (evt: any) => {
        let v = evt.target.value;
        this.setState({ value: v });
        if (this.props.onChange) {
            this.props.onChange({ name: this.props.name, value: v });
        }
    }
    render = () => {
        return <span className="v-filter">
            {
                this.props.options ? <OptionFilter value={this.state.value} name={this.props.name} options={this.props.options} onChange={this.onChange} />
                    : <TextFilter value={this.state.value} name={this.props.name} onChange={this.onChange} />
            }
        </span>
    }
    static check = (f: Filter, headers: Array<any>, row: any): boolean => {
        let idx = headers.findIndex((h) => h.text === f.name);
        if (idx < 0 || row.cols[idx] === undefined || row.cols[idx].text === undefined) {
            return false
        }
        else {
            return row.cols[idx].text.includes(f.value);
        }
    }
}
interface DataTableOptions {
    onDataChanged?: Function,
    show: number,
    pageSize?: number
}
interface DataTableProps {
    data: any,
    onSelectRow?: Function,
    onDataChanged?: Function,
    options?: DataTableOptions,
    filters?: Array<Filter>,
    columns?: Array<string>//visible cols
}
interface DataTableState {
    data: any,
    filters?: Array<Filter>
}

export class DataTable extends React.Component<DataTableProps, DataTableState> {
    options?: DataTableOptions;
    constructor(props: DataTableProps) {
        super(props);
        this.state = { data: props.data, filters: this.props.filters };
    }
    componentDidMount(): void {
        this.setState({ data: this.props.data, filters: this.props.filters });
    }

    shouldComponentUpdate = (nextProps: DataTableProps, nextState: DataTableState, nextContext: any): boolean => {
        if (this.state.data.rows.length !== nextProps.data.rows.length) {
            this.setState({ data: nextProps.data, filters: nextProps.filters });
            return true;
        }
        return false;
    }

    onSelectRow = (evt: any) => {
        evt.stopPropagation();
        if (this.props.onSelectRow) {
            let row = this.props.data.rows.find((d: any) => d.id === evt.currentTarget.id);
            this.props.onSelectRow(evt.currentTarget.id, row, evt.currentTarget);
        }
    }

    onRowChecked = (evt: any) => {
        console.log(evt);
    }

    onValueChange = (evt: any) => {
        let row_col = evt.target.id.split(".");
        const row = parseInt(row_col[0]);
        const col = parseInt(row_col[1]);
        let newData = { ...this.state.data };
        newData.rows[row].cols[col].value = evt.target.value;
        this.setState({ data: newData });
        if (this.props.options?.onDataChanged) {
            this.props.options.onDataChanged(this.state.data);
        }
        this.forceUpdate();
    }

    renderCell = (cellData: any, row: number, col: number) => {
        const id = `${row}.${col}`;
        return cellData.type === 'checkbox' ? <Form.Check id={id} checked={cellData.value} type="checkbox" onChange={this.onValueChange} />
            : cellData.type === 'button' ? <Button id={id} onClick={cellData.onClick} >{cellData.text}</Button>
                : cellData.type === 'input' ? <Form.Control type="text" id={id} onChange={this.onValueChange} value={cellData.value} />
                    : cellData.type === 'select' ? <Form.Select id={id} onChange={this.onValueChange} value={cellData.value || ''}>
                        {cellData.options.map((o: any, idx: number) => <option key={'o' + idx} value={o.value}>{o.text}</option>)}
                    </Form.Select> : cellData.text
    }

    handleFilterUpdate = (value: Filter) => {
        let filters = [...this.state.filters ? this.state.filters : []];
        filters = filters.filter((f) => f.name !== value.name);
        filters.push(value);
        this.setState({ filters: filters });
        this.forceUpdate();
    }

    render = () => {
        let tableData = this.state.data;
        if (!tableData) {
            return <div>No data available</div>
        }
        let rowsToShow = tableData.rows;
        let headers = [...tableData.headers];
        if (this.state.filters) {
            rowsToShow = tableData.rows.filter((row: any, idx: number) => {
                let filtered = true;
                this.state.filters?.forEach((f) => {
                    filtered = filtered && TableFilter.check(f, tableData.headers, row);
                })
                return filtered;
            });
        }
        rowsToShow = rowsToShow.slice(0, this.props.options?.pageSize ? this.props.options?.pageSize : 200);

        if(this.props.columns) {
            let cIdx : Array<number> = [];
            headers = headers.filter((h, idx:number) => {
                let found = this.props.columns?.find((c) => c===h.text) !== undefined;
                if (found) {
                    cIdx.push(idx);
                }
                return found;
            });
            rowsToShow = rowsToShow.map((r : any) => {
                return {
                    id: r.id,
                    cols: r.cols.filter((c : any, idx: number) => cIdx.includes(idx))
                }
            });
        }

        return (
            <div className="v-table" >
                {
                    this.props.filters ? <div className="v-filters">
                        {this.props.filters.map((filter: Filter, idx: number) =>
                            <TableFilter key={'h' + idx} value={filter.value} options={filter.options} onChange={this.handleFilterUpdate} name={filter.name} />)}
                    </div> : ""
                }
                <div className="v-table-container" >
                    <Table bordered hover size="sm">
                        <thead>
                            <tr >
                                {
                                    headers.map((col: any, idx: number) => {
                                        return <th className={"data-cell-header"} key={'h' + idx}>{col.type === 'checkbox' ? <Form.Check type="checkbox" /> : col.text
                                        }</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rowsToShow.map((row: any, idx: number) => {
                                    return <tr key={'r' + idx} onClick={this.onSelectRow} id={row.id}>
                                        {
                                            row.cols.map((col: any, jdx: number) => {
                                                return <td className={"data-cell-" + col.type} key={'c' + jdx}>
                                                    {
                                                        this.renderCell(col, idx, jdx)
                                                    }
                                                </td>
                                            })
                                        }
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}