import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
        ['bold', 'italic', 'underline', 'strike', 'code'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean'],
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'code',
    'color', 'background',
    'script',
    'list', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video',
];

export default function RichTextEditor({ value, onChange, placeholder = 'Describe learning goals, prerequisites, and syllabus highlights...', className = '', height = '220px' }) {
    return (
        <div className={`rich-text-editor-container ${className}`}>
            <style>{`
                .rich-text-editor-container .ql-container {
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                    font-family: inherit;
                    font-size: 0.95rem;
                    min-height: ${height};
                    background-color: #ffffff;
                }
                .rich-text-editor-container .ql-toolbar {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background-color: #f8f9fa;
                    border-color: #dee2e6;
                }
                .rich-text-editor-container .ql-container.ql-snow {
                    border-color: #dee2e6;
                }
                .rich-text-editor-container .ql-editor {
                    min-height: ${height};
                }
                .rich-text-editor-container .ql-editor.ql-blank::before {
                    color: #6c757d;
                    font-style: normal;
                }
            `}</style>
            <ReactQuill
                theme="snow"
                value={value || ''}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}
