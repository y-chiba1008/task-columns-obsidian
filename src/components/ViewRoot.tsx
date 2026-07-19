import { Notice } from "obsidian";
import { useState } from "react";

const ViewRoot = () => {
    const [cnt, setCnt] = useState(0);
    return (
        <div>
            <h4>Hello from custom view</h4>
            <button onClick={() => {
                new Notice(`Button clicked! ${cnt}`);
                setCnt(cnt + 1);
            }}>Click me</button>
        </div>
    );
};

export default ViewRoot;