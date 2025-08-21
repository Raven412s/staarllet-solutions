import React from "react";

interface EditorToolbarProps {
  editor: import('@tiptap/core').Editor;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, onImageUpload }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-2 items-center">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-green-200 text-green-900 px-2 py-1 rounded font-bold' : 'px-2 py-1 rounded'}><b>B</b></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-green-200 text-green-900 px-2 py-1 rounded font-bold' : 'px-2 py-1 rounded'}><span className="italic">I</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-green-200 text-green-900 px-2 py-1 rounded font-bold' : 'px-2 py-1 rounded'}><s>S</s></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-green-200 text-green-900 px-2 py-1 rounded font-bold' : 'px-2 py-1 rounded'}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-green-200 text-green-900 px-2 py-1 rounded font-bold' : 'px-2 py-1 rounded'}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-green-200 text-green-900 px-2 py-1 rounded font-bold' : 'px-2 py-1 rounded'}>• List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-green-200 text-green-900 px-2 py-1 rounded font-bold' : 'px-2 py-1 rounded'}>1. List</button>
      <label className="px-2 py-1 rounded cursor-pointer bg-green-50 border border-green-200 hover:bg-green-100">
        🖼️
        <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
      </label>
      <button type="button" onClick={() => {
        const url = prompt('Enter link URL');
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }} className="px-2 py-1 rounded">🔗</button>
      <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="px-2 py-1 rounded">Clear</button>
      {/* TODO: Add dropdowns for font size, font family, text color */}
    </div>
  );
};

export default EditorToolbar;
