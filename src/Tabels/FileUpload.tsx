import React, { useCallback,useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Input ,Button } from 'antd';
import axios from 'axios';

const {TextArea}  = Input;
const dataUploadUrl = "http://127.0.0.1:8000/upload/";

function Dropzone() {

  const [testResultFile,setTestResultFile] = useState<any>();
  const [testCaseFile,setTestCaseFile] = useState<any>();
  const [version , setVersion] = useState<any>();
  const [description ,setDescription] = useState<any>();


  // Handle accepted files
  const onDropTestResultCSV = useCallback((acceptedFiles:any) => {
    setTestResultFile(acceptedFiles);
    console.log();
  },[]);

  const onDropTestCaseCSV = useCallback((acceptedFiles:any) => {
    setTestCaseFile(acceptedFiles);
  },[])

  // Handle rejected files
  const rejectTestResultCSV = useCallback((fileRejections:any) => {
    fileRejections.forEach((file:any) => {
      const { errors, file: rejectedFile } = file;
      console.log(`Rejected file: ${rejectedFile.name}`);
      errors.forEach((error:any) => {
        if (error.code === "file-invalid-type") {
          console.log("Invalid file type");
        } else if (error.code === "file-too-large") {
          console.log("File is too large");
        } else if (error.code === "file-too-small") {
          console.log("File is too small");
        }
        // Additional error handling can be added here
      });
    });
  }, []);

  const rejectTestCaseCSV = useCallback((fileRejections:any) => {
    fileRejections.forEach((file:any) => {
      const { errors, file: rejectedFile } = file;
      console.log(`Rejected file: ${rejectedFile.name}`);
      errors.forEach((error:any) => {
        if (error.code === "file-invalid-type") {
          console.log("Invalid file type");
        } else if (error.code === "file-too-large") {
          console.log("File is too large");
        } else if (error.code === "file-too-small") {
          console.log("File is too small");
        }
        // Additional error handling can be added here
      });
    });
  }, []);

  const { getRootProps:testResultRootProps, getInputProps:testResultInputProps, isDragActive:testResultDrag } = useDropzone({
    onDrop:onDropTestResultCSV,
    onDropRejected:rejectTestResultCSV,
    accept: {
      "application/zip": ['.zip','.7z'],
    }
  });

  const { getRootProps:testCaseRootProps, getInputProps:testCaseInputProps, isDragActive:testCaseDrag } = useDropzone({
    onDrop:onDropTestCaseCSV,
    onDropRejected:rejectTestCaseCSV,
    accept: {
      "text/csv": [],
    }
  });

  const onHandleUpload = ()=> {
    const formData = new FormData();
    formData.append("version", version); 
    formData.append("description", description);
    formData.append("test_case_zip_file", testResultFile[0]);  
    formData.append("test_report_file", testCaseFile[0]);  


    // Send the POST request
    axios.post(dataUploadUrl, formData, {
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

   <div id='fileupload_outerContainer' style={{display:'flex',alignItems:'center',justifyContent:'center',height:'97vh'}} >
      <div id='innerContainer' style={{width:'35%',height:'47%',padding:'12px',borderRadius:'15px'}}>
      <Card hoverable={true}>
            <div id='table_title' style={{}}>
              <span>Version</span>
              <Input  style={{position:'relative',top:'5px'}} onChange={(e) =>setVersion(e.target.value) }/>
            </div>
            <br></br>
            <div id='drag_drop_test_result' style={{}}>
              <span>Test Result</span>
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
                <p>
                  {testResultFile ? 'File uploaded sucessfully' : 'Drag & Drop csv files here, or click to select files '}
                </p>
              )}
              </div>
            </div>
            <br></br>
            <div style={{color:'blue'}}>{testResultFile ? 'FileName:  '+ testResultFile[0].path : ''}</div>
            <br></br>
            <div id='drag_drop_test_case' style={{}}>
            <span>Test Case</span>
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
                <p>
                  {testCaseFile ? 'File uploaded sucessfully' : 'Drag & Drop csv files here, or click to select files '}
                </p>
              )}
              </div>
            </div>
            <br></br>
            <div style={{color:'blue'}}>{testCaseFile ? 'FileName:  '+ testCaseFile[0].path : ''}</div>
            <div id='description' style={{height:'40%'}}>
             <br></br> 
            <span>Description</span>
                <TextArea
                style={{height:'80%',position:'relative',top:'5px' ,resize:'none' }}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div id="user_action" style={{position:'relative',top:'15px',textAlign:'right'}}>
              <Button type="primary" onClick={onHandleUpload}>Upload</Button>
            </div>
      </Card>   
      </div>
   </div> 

  );
}

export default Dropzone;
