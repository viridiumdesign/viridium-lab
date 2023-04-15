import React from "react";
import { PureComponent } from "react";
import StringUtils from "../v-utils/v-string-utils";
import "./code.css"
type CodeViewerProps = {
    lang?: string,
    title?: string,
    url?: string,
    text?: string
}

type CodeViewerState = {
    src: string
}
export default class CodeViewer extends PureComponent<CodeViewerProps, CodeViewerState> {
    constructor(props: CodeViewerProps) {
        super(props);
        this.state = { src: "" };
    }
    componentDidUpdate(prevProps: Readonly<CodeViewerProps>, prevState: Readonly<CodeViewerState>, snapshot?: any): void {
        this.updateView();
    }
    componentDidMount(): void {
        this.updateView();
    }

    updateView =() => {
        if (this.props.text) {
            this.setState({ src: this.props.text });
        }
        else if (this.props.url) {
            fetch(this.props.url).then((response) => {
                if (response.status !== 200) {
                    console.debug('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.text().then((value) => {
                    this.setState({ src: value });
                });
            }
            ).catch((err) => {
                console.error('Fetch Error :-S', err);
            });
        }
    }
    render() {
        return <div className="v-code">
            <div className="v-code-header">{this.props.title ? this.props.title : StringUtils.t("code")}</div>
            <pre className="v-code-viewer"> {this.state.src} </pre>
        </div>
    };
}
