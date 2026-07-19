import { Notice } from "obsidian";
import { useState } from "react";
import { useVaultFilesStore } from "../stores/vaultFilesStore";

const ViewRoot = () => {
    const [cnt, setCnt] = useState(0);
    const files = useVaultFilesStore((state) => state.files);

    return (
        <div>
            <h4>Hello from custom view</h4>
            <button onClick={() => {
                new Notice(`Button clicked! ${cnt}`);
                setCnt(cnt + 1);
            }}>Click me</button>

            <ul>
                {files.map((file) => (
                    <li key={file.path}>{file.basename}</li>
                ))}
            </ul>
        </div>
    );
};

export default ViewRoot;