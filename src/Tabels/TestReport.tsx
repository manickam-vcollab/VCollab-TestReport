import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { Table } from 'antd';
import { Button, Input, Select, Space } from 'antd'
import {
  FilterFilled
} from '@ant-design/icons';
import { Typography } from 'antd';

import {serverBaseURL} from '../Utils/config';


const { Title } = Typography;
const resultTableUrl: string = "/result?id=";
let tableTitle: any;
let tableColumn: any[] = [];
let inputThreshold: any;
const columnMaxLimit: number = 4;
const baseUrl = serverBaseURL;


const TestReportTable = () => {

  const [filteredData, setFilteredData] = useState<any[]>();
  const [columns, setColumns] = useState<any[]>();
  const [initialData, setInitialData] = useState<any[]>();

  const [searchedColumn, setSearchedColumn] = useState('');
  const [ssiFilterOption, setSsiFilterOption] = useState<any>('');
  const [isDataFilter, setIsDataFilter] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<any>();

  const urlParams = new URLSearchParams(window.location.search);
  const testCaseID = urlParams.get('id')

  // SSI Score Filter  
  const options = [
    {
      value: '=',
      label: '=',
    },
    {
      value: '!=',
      label: '!=',
    },
    {
      value: '>',
      label: '>',
    },
    {
      value: '>=',
      label: '>=',
    },
    {
      value: '<',
      label: '<',
    },
    {
      value: '<=',
      label: '<=',
    },
  ];

  // table title
  const generateTableTitle = (title: any[]) => {
    let tableTitle: any = ''
    if (title) {
      title.forEach((item: any) => {
        tableTitle = tableTitle + '  ' + item;
      })
      return tableTitle

    }

  }
  // set Filter ssi score option
  const handleChange = (value: string) => {
    setSsiFilterOption(value);
  };
  // filter ssi score
  const filterTableSSIScore = (source: any, filtervalue: string, filterSign: string, filterColumn: string) => {
    const filterInput = Number(filtervalue);
    let filteredData: any[] = [];

    if (filtervalue != '' && filtervalue != undefined) {
      source.forEach((item: any) => {
        const ssiScore = Number(item[filterColumn]);

        if (filterSign === '=') {
          if (ssiScore === filterInput) {
            filteredData.push(item);
          }

        } else if (filterSign === '!=') {

          if (ssiScore != filterInput) {
            filteredData.push(item);
          }
        }
        else if (filterSign === '>') {

          if (ssiScore > filterInput) {
            filteredData.push(item);
          }

        }
        else if (filterSign === '>=') {

          if (ssiScore >= filterInput) {
            filteredData.push(item);
          }

        }
        else if (filterSign === '<') {

          if (ssiScore < filterInput) {
            filteredData.push(item);
          }

        }
        else if (filterSign === '<=') {

          if (ssiScore <= filterInput) {
            filteredData.push(item);
          }

        }

      })
      // Arrange serial number
      filteredData.forEach((row, index) => {
        row['S.NO'] = index + 1;
      })
      setFilteredData(filteredData);
    } else {
      setFilteredData(source);
    }

  }
  // generate ssi custom gui
  const getSSIScoreCustomFilter = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, close }: any) => (
      <div id='Container' style={{ width: '220px', height: '80px', padding: 8 }}>
        <div onKeyDown={(e) => e.stopPropagation()}>
          <div id='UserInput'>
            <Space.Compact>
              <Select
                options={options}
                style={{ width: '32%' }}
                onChange={handleChange} />
              <Input
                type='number'
                value={selectedKeys[0]}
                placeholder={`Search ${dataIndex}`}
                onChange={(e) => { setUserInput(e.target.value); setSelectedKeys(e.target.value ? [e.target.value] : []) }}
              />
            </Space.Compact>
          </div>

          <div style={{ position: 'relative', top: '18px', width: '240px', border: '1px solid #f3f3f3e8', marginLeft: '-10px' }}></div>
          <div id='userActions' style={{ position: 'relative', top: '25px', textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  close();
                  setSearchedColumn(dataIndex);
                  setIsDataFilter(true);
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSelectedKeys([]);
                  setUserInput('');
                }}
              >
                Clear
              </Button>
            </Space>
          </div>

        </div>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <FilterFilled
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    //onFilter: (value: string, record:any) => record.SSI_Score.indexOf(value as string) === 0,
  });
  // filter only passed record
  const getFailedRecord = () => {

    let failedRecord: any[] = [];

    initialData?.forEach((row: any) => {

      if (row.Test_Result.toLowerCase() === 'fail') {
        failedRecord.push(row);
      }

    })

    return failedRecord;

  }
  // filter only failed record
  const getPassedRecord = () => {
    let passedRecord: any[] = [];

    initialData?.forEach((row: any) => {
      if (row.Test_Result.toLowerCase() === 'pass') {
        passedRecord.push(row);
      }
    })

    return passedRecord;
  }

  // Handle table changes such as filters, sorting, pagination
  const handleTableDataChange = (pagination: any, filters: any, sorter: any, extra: any) => {

    let filteredRecord: any[] = [];
    if (extra.action === 'filter') {
      if (filters.Test_Result) {

        // filter pass or fail record        
        if (filters.Test_Result.length === 1) {

          if (filters.Test_Result[0] === 'FAIL') {
            filteredRecord = getFailedRecord();
          }
          else if (filters.Test_Result[0] === 'PASS') {
            filteredRecord = getPassedRecord();
          }

        } else if (filters.Test_Result.length === 2) {
          setFilteredData(initialData);
        } else {
          setFilteredData(initialData);
        }
        // update serial number
        if (filteredRecord.length > 0) {


          filteredRecord.forEach((row: any, index: number) => {
            row['S.NO'] = index + 1;
          })
          setFilteredData(filteredRecord);
        }

      } else {
        setFilteredData(initialData);
      }
    }
  };

  // create table column and row
  const generateTableData = (data: any) => {
    const tableData: any[] = data.data.slice(5);
    tableTitle = data.data[0];
    inputThreshold = data.data[1];
    tableColumn = data.data[4];
    tableColumn = [...tableColumn.slice(0, 0), 'S.NO', ...tableColumn.slice(0)];

    const columnData: any[] = [];
    const rowData: any[] = [];
    let failData: any[] = [];
    let passData: any[] = [];
    let combaineArray: any[] = [];
    let filterColumn = '';

    // generate data source (rows)
    tableData?.forEach((row: any, rowIndex: number) => {
      if (row.length >= 2) {
        rowData.push(createDataSource(row, tableColumn, rowIndex))
      }
    })

    // display fail case first   
    rowData.forEach((item) => {
      if ((item.Test_Result).toLowerCase() === 'fail') {
        failData.push(item);
      } else if ((item.Test_Result).toLowerCase() === 'pass') {
        passData.push(item);
      }
    })

    combaineArray = [...failData, ...passData];
    combaineArray.forEach((row, index) => {
      row['S.NO'] = index + 1;
    })
    setFilteredData(combaineArray);
    setInitialData(combaineArray);
    // generate column
    tableColumn?.forEach((item: any, index: number) => {
      if (index <= columnMaxLimit) {
        if (tableColumn.length === index + 3) {
          filterColumn = item.replace(/ /g, "_");
          item.replace(/ /g, "_")
          columnData.push({
            title: item,
            dataIndex: item.replace(/ /g, "_"),
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
            //onFilter: (value: string, record: any) => record.Test_Result.indexOf(value as string) === 0,
            // case senstive update
           // onFilter: (value: string, record: any) => record[filterColumn].toLowerCase().indexOf(value.toLowerCase()) >= 0,
            render(text: any) {
              return {
                props: {
                  style: { color: text === 'PASS' ? "green" : "red", fontWeight: 500 }
                },
                children: <div>{text}</div>
              };
            }
          })
        } else {

          if (index === 1) {
            columnData.push({
              title: item,
              dataIndex: item.replace(/ /g, "_"),
              render: (text: any) => <a id={text} href={resultTableUrl + text + '&'+'fileid=' + testCaseID}>{text}</a>,
            })

          } else if (index === 3) {

            columnData.push({
              title: item,
              dataIndex: item.replace(/ /g, "_"),
              ...getSSIScoreCustomFilter(item),
            })

          }
          else {
            columnData.push({
              title: item,
              dataIndex: item.replace(/ /g, "_"),
            })
          }
        }
      }
    })
    setColumns(columnData);
  }

  // rows data
  const createDataSource = (row: any, columnName: any, rowIndex: number) => {
    const rowData: any = {};
    row.forEach((data: any, index: number) => {

      if (index === 0) {
        const serialNumber = rowIndex;
        rowData[columnName[index].replace(/ /g, "_")] = serialNumber + 1;
      }
      rowData[columnName[index + 1].replace(/ /g, "_")] = data;
      rowData['key'] = rowIndex;
    })
    return rowData
  }

  // load and parse CSV file 
  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const testReportID = urlParams.get('id');
    const url = `${baseUrl}/get-testReport-data/${testReportID}`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url); 
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

  // filter function call  
  useEffect(() => {

    if (isDataFilter === true) {
      filterTableSSIScore(initialData, userInput, ssiFilterOption, searchedColumn.replace(/ /g, "_"));
    }
    setIsDataFilter(false);

  }, [isDataFilter])

  // handle clear user input and filters
  useEffect(() => {
    if (userInput === '') {
      setFilteredData(initialData);
    }


  }, [userInput])


  return (
    <>
      <Title level={4} style={{ textAlign: 'center' }}>{generateTableTitle(tableTitle)}</Title>
      <Title level={5} style={{ textAlign: 'right', paddingRight: '10px', color: 'red' }}>{generateTableTitle(inputThreshold)}</Title>
      <Table
        columns={columns}
        dataSource={filteredData}
        onChange={handleTableDataChange}
        pagination={{
          defaultPageSize: 10, showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30']
        }} />
    </>

  );
};

export default TestReportTable;