import React, { useState } from "react";
import { Modal, Upload, Button, message } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import api from "../../utils/api";

const BulkUploadModal = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const downloadTemplate = async () => {
    try {
      const response = await api.get(
        "/api/damanorganic/products/bulk-upload-template",
      );

      // Get filename from header if backend sends it
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "products_upload_template.csv";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch?.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      messageApi.error(
        error?.response?.data?.message || "Failed to download template",
      );
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return messageApi.warning("Please select a CSV file");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const { data } = await api.post(
        "/api/damanorganic/products/bulk-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      messageApi.success(data.message || "Products uploaded successfully");

      setFile(null);
      setFileList([]);
      onClose();
    } catch (error) {
      const res = error?.response?.data;

      if (res?.errors && Array.isArray(res.errors)) {
        res.errors.forEach((err) => messageApi.error(err || "errors"));
      } else {
        messageApi.error(res?.message || "Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title="Bulk Product Upload"
      >
        <div className="flex flex-col gap-4">
          <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
            Download Sample CSV
          </Button>

          <Upload
            fileList={fileList}
            beforeUpload={(file) => {
              const isCSV =
                file.type === "text/csv" ||
                file.type === "application/vnd.ms-excel" ||
                file.name.endsWith(".csv");

              if (!isCSV) {
                message.error("Only CSV files allowed");
                return Upload.LIST_IGNORE;
              }

              setFile(file);
              setFileList([file]);

              return false;
            }}
            onRemove={() => {
              setFile(null);
              setFileList([]);
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select CSV File</Button>
          </Upload>

          <Button type="primary" loading={loading} onClick={handleUpload}>
            Upload Products
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BulkUploadModal;
