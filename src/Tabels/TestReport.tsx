import React ,{useEffect,useState} from 'react';
import Papa from 'papaparse';
import { Table } from 'antd';

const csvFilePath:string = "TestingReport.csv"; 
const resultTableUrl:string = "/result?id=";
let tableTitle:any ;

const TestReportTable = () => {

  const [dataSource,setDataSource] = useState<any[]>();
  const [columns,setColumns] = useState<any[]>();

  const generateTableData = (data:any,column:any)=>{
    const tableData:any[]  = data.data.slice(1);
    tableTitle = data.data[0];
    const columnData:any[] = [];
    const rowData:any[] =[];

    // generate column
    column?.forEach((item:any,index:number) => {
      if(column.length === index+1) {
        columnData.push({
          title: item, 
          dataIndex: item.replace(/ /g,"_"),
          filters: [
            {
              text: 'PASS',
              value: 'PASS',
            },
            {
              text: 'FAIL',
              value: 'FAIL',
            },
          ],
          onFilter: (value: string, record:any) => record.Test_Result.indexOf(value as string) === 0,
          // render(text:any) {
          //   return {
          //     props: {
          //       style: { color: text === 'PASS' ? "green" : "red" }
          //     },
          //     children: <div>{text}</div>
          //   };
          // }
          
      })
      } else{

        if(index === 1){
          columnData.push({
            title: item, 
            dataIndex: item.replace(/ /g,"_"),
            render: (text:any) => <a id={text}  href={resultTableUrl+text}>{text}</a>,
          })

        }else {
          columnData.push({
            title: item, 
            dataIndex: item.replace(/ /g,"_"),
          })
        }


      }

    })

    setColumns(columnData);
    // generate data source (rows)
    tableData?.forEach((row:any,rowIndex:number) => (
      rowData.push(createDataSource(row,column,rowIndex))
    ))
    setDataSource(rowData);
  }

    // rows data
  const createDataSource =(row:any,columnName:any,rowIndex:number)=>{
    const rowData:any = {};
    row.forEach((data:any,index:number)=>{
      
      if(index === 0) {
        const serialNumber = rowIndex;
        rowData[columnName[index].replace(/ /g,"_")] = serialNumber + 1;
      }
      rowData[columnName[index+1].replace(/ /g,"_")] = data;
      rowData['key'] = rowIndex;
    })
    return rowData
  }
  
  useEffect(() => {
    Papa.parse(csvFilePath, {
      download: true,
      complete: function(results) {
        const tableColumns = ['S.NO','Test Case ID','Test Case','Test Result'];
        generateTableData(results,tableColumns);
      }
  });

  }, []);


  return(
    <>
       <h3 style={{textAlign:'center'}}>{tableTitle}</h3>
       <Table columns={columns} dataSource={dataSource} />
    </>

  );
};

export default TestReportTable;