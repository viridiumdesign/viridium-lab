import React, { PureComponent } from 'react'
import { AiFillCaretRight } from "react-icons/ai";
import StringUtils from '../v-utils/v-string-utils';

import "./v-nav-slider.css";

type OptionValue = {
    value: string,
    label: string
}

type NavSliderProps = {
    id?: string,
    className?: string,
    style?: any;
    options: Function | Array<OptionValue>,
    onChange?: Function;
    value?: any;
    label?: string;
    placeholder?: string;
}

type NavSliderState = {
    selected?: string
}

export default class NavSlider extends PureComponent<NavSliderProps, NavSliderState>{
    id: string;

    constructor(props: NavSliderProps) {
        super(props);
        this.id = this.props.id ? this.props.id : StringUtils.guid();
        this.state = { selected: this.props.value };
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.value !== prevProps.value) {
            console.log(this.props.value, prevProps.value);
            this.setState({ selected: this.props.value });
        }
    }
    onSelect = (evt: any) => {
        if (this.props.onChange) {
            this.props.onChange(evt.currentTarget.id);
        }
        this.setState({ selected: evt.currentTarget.id })
    }
    getOptions = (): Array<OptionValue> | undefined => {
        if (this.props.options instanceof Array) {
            return [...this.props.options]
        }
        if (this.props.options instanceof Function) {
            return this.props.options();
        }
    }

    render = () => {
        return <div id={this.id} style={this.props.style}
                className={(this.props.className ? this.props.className : "") + " v-nav-slider-container"}>
                {
                    this.getOptions()?.map((opt: any, idx) => {
                        return <div id={opt.value} key={idx} onClick={this.onSelect}
                            className={"v-nav-slider-item" + (opt.value === this.state.selected ? " v-selected" : "")} >
                            <span className={"v-icon" + (opt.value === this.state.selected ? " v-selected" : "")}>
                                <AiFillCaretRight />
                            </span>
                            <span className="v-label">{opt.label} </span>
                        </div>
                    })
                }
            </div >
        
    }
}