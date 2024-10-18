import React from "react";

interface MemoTextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}

const MemoTextarea: React.FC<MemoTextareaProps> = ({ value, onChange, placeholder }) => {
    return (
        <textarea
            className="memotextarea"
            value={value}
            onChange={(e) => {
                onChange(e);
                e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder={placeholder}
        />
    );
};

export default MemoTextarea;
