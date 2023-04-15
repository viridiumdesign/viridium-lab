import React from 'react'
import { VscArrowDown, VscSearch } from 'react-icons/vsc';
import StringUtils from '../v-utils/v-string-utils';
import "./v-select.css";
type OptionValue = {
    value: string,
    label: string
}

type SelectProps = {
    id?: string,
    options: Function | Array<OptionValue>,
    onChange?: Function;
    value?: any;
    label?: string;
    placeholder?: string;
    entity? : any;
}

type SelectState = {
    selected?: OptionValue
    searchValue: string
}

export default class Select extends React.Component<SelectProps, SelectState>{
    id: string;
    constructor(props: SelectProps) {
        super(props);
        this.id = this.props.id ? this.props.id : StringUtils.guid();
        this.state = { selected: undefined, searchValue: "" };
    }
    onChange = (evt: any) => {
        this.setState({ searchValue: evt.currentTarget.value });
        this.showList();
    }
    onSelect = (evt: any) => {
        let idx = evt.currentTarget.id.slice(this.id.length + 1);
        console.debug("option is selected", evt.currentTarget, evt.currentTarget.id, idx);
        let option = this.getOptions()?.find((o: any) => o.value === idx);
        if (option) {
            this.setState({ searchValue: option.label });
            if (this.props.onChange) {
                this.props.onChange({value:option.value, ...evt}, option);
            }
            this.hideList();
        }
    }
    showList = () => {
        let list = document.getElementById(this.id + "_list") as any;
        list.style.display = "block";
    }
    hideList = () => {
        let list = document.getElementById(this.id + "_list") as any;
        list.style.display = "none";
    }
    toggleList = () => {
        let list = document.getElementById(this.id + "_list") as any;
        if (list.style.display === "block") {
            list.style.display = "none"
        } else {
            list.style.display = "block";
            this.setState({ searchValue: "" });
        
        }
    }
    onDropdown = (evt: any) => {
        this.toggleList();
    }
    onClear = (evt: any) => {
        this.setState({ searchValue: "" })
    }
    getOptions = (): Array<OptionValue> | undefined => {
        if (this.props.options instanceof Array) {
            return this.props.options.filter((option) => {
                return option.label.toLocaleLowerCase().includes(this.state.searchValue.toLocaleLowerCase());
            });
        }
        if (this.props.options instanceof Function) {
            return this.props.options(this.state.searchValue);
        }
    }
    onMouseLeave = (evt: any) => {
        evt.currentTarget.classList.remove("v-highlight");
    }
    onMouseEnter = (evt: any) => {
        evt.currentTarget.classList.add("v-highlight");
    }
    render = () => {
        let ph = this.props.placeholder ? this.props.placeholder : StringUtils.t("search");
        return (
            <div id={this.id} className="v-search-select-container">
                {
                    this.props.label ? <label className="v-select-label">{this.props.label}</label> : ""
                }
                <div className="v-select-input-box">
                    <input placeholder={ph} className="v-select-input" value={this.state.searchValue} onChange={this.onChange}></input>
                    <VscArrowDown className="v-select-drop-icon" onClick={this.onDropdown} />
                    <VscSearch className="v-select-x-icon" onClick={this.onClear} />
                </div>
                <ul id={this.id + "_list"} className="v-select-list" >
                    {
                        this.getOptions()?.map((option: any, idx: number) => {
                            return <li id={this.id + "_" + option.value} key={idx} className="v-select-option" onMouseEnter={this.onMouseEnter}
                                onMouseLeave={this.onMouseLeave}
                                onClick={this.onSelect} >
                                <span className="v-select-option-text"> {option.label}</span>
                            </li>
                        })
                    }
                </ul>
            </div >
        )
    }
}