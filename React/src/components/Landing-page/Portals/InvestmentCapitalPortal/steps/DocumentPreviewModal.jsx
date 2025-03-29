import React from "react";

const DocumentPreviewModal = ({ file, isOpen, onClose }) => {
    const renderFilePreview = () => {
        const fileExtension = file.name.split(".").pop().toLowerCase();

        switch (fileExtension) {
            case "pdf":
                return (
                    <iframe
                        src={URL.createObjectURL(file)}
                        className="w-full h-[500px]"
                        title="Document Preview"
                    />
                );
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return (
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Document Preview"
                        className="max-w-full max-h-[500px] object-contain"
                    />
                );
            default:
                return (
                    <div className="text-center p-4 text-gray-500">
                        Preview not available for this file type
                    </div>
                );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">{file.name}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">{renderFilePreview()}</div>
            </div>
        </div>
    );
};

export default DocumentPreviewModal;