import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Input, Button } from 'antd';
import axios from 'axios';
import { serverBaseURL } from "../Utils/config";
import style from './FileUploadStyle';

const { TextArea } = Input;
const fileUploadURL = `${serverBaseURL}/upload/`;

function Dropzone() {

  const [testResultFile, setTestResultFile] = useState<any>();
  const [testCaseFile, setTestCaseFile] = useState<any>();
  const [version, setVersion] = useState<any>();
  const [description, setDescription] = useState<any>();
  const [zipFileTypeError, setZipFileTypeError] = useState<null | String>(null);
  const [csvFileTypeError, setCsvFileTypeError] = useState<null | String>(null);

  const cssObjects = style();

  // Handle accepted files
  const onDropTestResultCSV = useCallback((acceptedFiles: any) => {
    setTestResultFile(acceptedFiles);
    setZipFileTypeError(null);
  }, []);

  const onDropTestCaseCSV = useCallback((acceptedFiles: any) => {
    setTestCaseFile(acceptedFiles);
    setCsvFileTypeError(null);
  }, [])

  // Handle rejected files
  const rejectTestResultCSV = useCallback((fileRejections: any) => {
    fileRejections.forEach((file: any) => {
      const { errors, file: rejectedFile } = file;
      console.log(`Rejected file: ${rejectedFile.name}`);
      errors.forEach((error: any) => {
        if (error.code === "file-invalid-type") {
          setZipFileTypeError(`Invalid file type: ${rejectedFile.name} You should upload .zip`);
        } else if (error.code === "file-too-large") {
          console.log("File is too large");
        } else if (error.code === "file-too-small") {
          console.log("File is too small");
        }
        // Additional error handling can be added here
      });
    });
  }, []);

  const rejectTestCaseCSV = useCallback((fileRejections: any) => {
    fileRejections.forEach((file: any) => {
      const { errors, file: rejectedFile } = file;
      errors.forEach((error: any) => {
        if (error.code === "file-invalid-type") {
          setCsvFileTypeError(`Invalid file type: ${rejectedFile.name} You should upload .csv`);
        } else if (error.code === "file-too-large") {
          console.log("File is too large");
        } else if (error.code === "file-too-small") {
          console.log("File is too small");
        }
        // Additional error handling can be added here
      });
    });
  }, []);

  const { getRootProps: testResultRootProps, getInputProps: testResultInputProps, isDragActive: testResultDrag } = useDropzone({
    onDrop: onDropTestResultCSV,
    onDropRejected: rejectTestResultCSV,
    accept: {
      "application/zip": ['.zip', '.7z'],
    }
  });

  const { getRootProps: testCaseRootProps, getInputProps: testCaseInputProps, isDragActive: testCaseDrag } = useDropzone({
    onDrop: onDropTestCaseCSV,
    onDropRejected: rejectTestCaseCSV,
    accept: {
      "text/csv": [],
    }
  });

  const onHandleUpload = () => {
    const formData = new FormData();
    formData.append("version", version);
    formData.append("description", description);
    formData.append("test_report_zip_file", testResultFile[0]);
    formData.append("test_case_file", testCaseFile[0]);

    // Send the POST request
    axios.post(fileUploadURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log(response.status);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });

  }

  return (

    <div id='fileupload_outerContainer' style={{ display: 'flex',justifyContent: 'center', height: '97vh'}} >
      <div id='innerContainer' style={{ width: '35%', height: '80%', padding: '12px', borderRadius: '15px'}}>
        <Card style={{boxShadow:'-1px 2px 8px 8px rgba(0,0,0,0.2)'}} title={<div>File Upload</div>} extra={<div style={{marginTop:'7px'}}><img src="LogoBig.svg" width='80px' height='30px'/></div>}>
          <div id='version' className={cssObjects.label}>
            <span>Version</span>
            <Input style={{ position: 'relative', top: '5px' }}  onChange={(e) => setVersion(e.target.value)} />
          </div>
          <br></br>
          <div id='drag_drop_test_result' style={{cursor:'pointer'}}>
            <span className={cssObjects.label}>Test Result</span>
            <div
              {...testResultRootProps()}
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
              }}>
              <input {...testResultInputProps()} />
              {testResultDrag ? (
                <p>Drop the files here...</p>
              ) : (
                <span>
                  {testResultFile ? <p className={cssObjects.placeHolder}>{testResultFile.length > 0 ? 'File uploaded sucessfully' : 'Drag & Drop files here, or click to select files '}</p> :<p className={cssObjects.placeHolder}>Drag & Drop files here, or click to select files</p> }
                </span>
              )}
            </div>
          </div>
          <br></br>
          <div id="zipfile-upload-status">
            {testResultFile ? <div className={cssObjects.sucessMsg}>{testResultFile.length > 0 ? 'FileName:  ' + testResultFile[0].path : ''}</div> : null}
            <div id='file-type-error' className={cssObjects.errorMsg}>
              {zipFileTypeError ? zipFileTypeError : null}
            </div>
          </div>
          <br></br>
          <div id='drag_drop_test_case' style={{cursor:'pointer'}} >
            <span className={cssObjects.label}>Test Case</span>
            <div
              {...testCaseRootProps()}
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <input {...testCaseInputProps()} />
              {testCaseDrag ? (
                <p>Drop the files here...</p>
              ) : (
                <span>
                  {testCaseFile ? <p className={cssObjects.placeHolder}>{testCaseFile.length > 0 ? 'File uploaded sucessfully' : 'Drag & Drop csv files here, or click to select files '}</p> : <p className={cssObjects.placeHolder}>Drag & Drop csv files here, or click to select files </p>}
                </span>
              )}
            </div>
          </div>
          <br></br>
          <div id="csvfile-upload-status">
            {testCaseFile ? <div className={cssObjects.sucessMsg}>{testCaseFile.length > 0 ? 'FileName:  ' + testCaseFile[0].path : ''}</div> : null}
            <div id='file-type-error' className={cssObjects.errorMsg}>
              {csvFileTypeError ? csvFileTypeError : null}
            </div>
          </div>
          <div id='description' style={{ height: '40%' }} className={cssObjects.label}>
            <br></br>
            <span>Description</span>
            <TextArea
              style={{ height: '80%', position: 'relative', top: '5px'}}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div id="user_action" style={{ position: 'relative', top: '15px', textAlign: 'right'}}>
            <Button type="primary" onClick={onHandleUpload}>Click to Dashboard</Button>
            <Button type="primary" onClick={onHandleUpload}>Upload</Button>
          </div>
        </Card>
      </div>
    </div>

  );
}

export default Dropzone;
