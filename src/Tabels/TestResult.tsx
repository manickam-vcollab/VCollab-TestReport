import React ,{useEffect,useState}from "react";
import Papa from 'papaparse';
import axios from 'axios';
import { Table } from 'antd';
import { Descriptions , Button} from 'antd';
import type { DescriptionsProps } from 'antd';

import {serverBaseURL} from '../Utils/config';


const urlParams = new URLSearchParams(window.location.search);
const testCaseID = urlParams.get('id');

const tableTitle:string = 'VCollab Testcases';
const baseUrl = serverBaseURL;
const testReportID = urlParams.get('fileid');
const url = `${baseUrl}/get-testCase-data/${testReportID}`;

const compareTableUrl:string = `/image_compare?id=${testCaseID}&fileid=${testReportID}`;

const TestResult = (props:any) => {

  const [aboutData ,setAboutData] = useState<DescriptionsProps['items']>();
  const [resultData , setResultData] = useState<DescriptionsProps['items']>();
  const [dataSource,setDataSource] = useState<any[]>();
  const [columns,setColumns] = useState<any[]>();

  // manin function
  const generateTableData=(tableData:any)=>{
    const tableALLData:any[] = tableData.data;
    const aboutHeading:any[] = tableData.data[0];
    const aboutData:any[] = tableData.data[1];
    const resultHeading:any[] = tableData.data[2];
    let matchedData:any[] = [];

    tableALLData.forEach((items:any)=>{
      if(items[0] === testCaseID) {
          matchedData = items;
      }
    })

    generateAboutTable(aboutHeading,aboutData);
    generateResultTable(resultHeading,matchedData);
    generateTestCaseTable(resultHeading,tableALLData);
  }

  const generateAboutTable =(heading:any,data:any)=>{
    let aboutData:any =[];
    heading.forEach((items:any ,index:number)=>{
      aboutData.push(
        {
          label: items,
          children: data[index],
        },
      )
    })
    setAboutData(aboutData);
  }

  const generateResultTable =(resultHeading:any,matchedData:any)=>{
    let resultData:any =[];
    let lastColumn = resultHeading.length - 1;
    resultHeading.forEach((items:any ,index:number)=>{
        resultData.push(
          {
            label: items,
            //children: lastColumn === index ? <Button type="primary"><a href={compareTableUrl+testCaseID}>Compare</a></Button>: matchedData[index]
            children: matchedData[index]
          },
        )

    })
    setResultData(resultData);
  }

  const generateTestCaseTable=(heading:any,allData:any)=>{

    const tableData:any[]  = allData;
    const tableTitle = heading;
    const columnData:any[] = [];
    const rowData:any[] =[];
    tableData.splice(0,3);

    tableTitle?.forEach((item:any,index:number) => {
          columnData.push({
            title: item, 
            dataIndex: item.replace(/ /g,"_"),
          })
    })
    setColumns(columnData);

    // generate data source (rows)
    tableData?.forEach((row:any,rowIndex:number) => {
      rowData.push(createDataSource(row,tableTitle,rowIndex))
  })

    setDataSource(rowData);    
  }

  const createDataSource =(row:any,columnName:any,rowIndex:number)=>{
      const rowData:any = {};
      row.forEach((data:any,index:number)=>{
        
        // if(index === 0) {
        //   const serialNumber = rowIndex;
        //   rowData[columnName[index].replace(/ /g,"_")] = serialNumber + 1;
        // }
        if(data !== '') {
          rowData[columnName[index].replace(/ /g,"_")] = data;
          rowData['key'] = rowIndex;
        }

      })
      return rowData
  }

  useEffect(() => {

    const fetchData = async () => {
      try {

        const response = await axios.get(url); // Replace with your API URL
        if(response.status === 200) {
              Papa.parse(url, {
              download: true,
              complete: function (results) {
                generateTableData(results);
              }
            });
        }
        
      } catch (err) {
        console.log(err); // Set error if request fails
      } finally {
        
      }
    };

    fetchData();
  }, []);
  return (
    <div>
    <Descriptions
    title="Test Descriptions"
    bordered
    column={ 1 }
    items={aboutData}
    size={'small'}
  />
  {testCaseID !== null && testCaseID !== '' ? <Descriptions
    title="Result Descriptions"
    bordered
    column={ 1 }
    items={resultData}
    size={'small'}
  />: <div><div style={{marginTop:'10px',marginBottom:'10px',fontWeight:500}}>{tableTitle}</div><Table columns={columns} dataSource={dataSource} /></div>}
   {testCaseID !== null && testCaseID !== '' ? <div style={{display:'flex',justifyContent:'center',position:'relative',top:'10px',paddingBottom:'20px'}}><Button type="primary"><a href={compareTableUrl}>Image Compare</a></Button></div>:null}
    </div>
  )
};

export default TestResult;
