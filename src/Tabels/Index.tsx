import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

async function getInfo(): Promise<any> {
  const url = "http://127.0.0.1:8000/getInfo/";

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error occurred: ${error.message}`);
    } else {
      console.error(`Other error occurred: ${error}`);
    }
    return null;
  }
}

const IndexPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    // Fetch the data using the getInfo function
    getInfo().then((info) => {
      if (info) {
        // Get column names from object keys
        const columnNames = Object.keys(info[0] || {}).filter(key => key !== 'unique_id');
        const serialNumberColumn = {
          title: 'S.No',
          dataIndex: 'serialNumber',
          key: 'serialNumber',
          render: (_: any, __: any, index: number) => index + 1, 
        };
        // Set columns for the table and capitalize titles
        const tableColumns = [
          serialNumberColumn,
          ...columnNames.map((key) => ({
            title: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()), 
            dataIndex: key,
            key: key,
          })),
          {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
              <Button 
                type="primary" 
                onClick={() => navigate(`/test_report?id=${record.unique_id}`)} // Navigate to different page
              >
                Open
              </Button>
            ),
          },
        ];

        // Set the rows using the data returned
        const tableData = info.map((item: any, index: number) => ({
          ...item,
          key: index, // Add a key for each row
        }));

        setColumns(tableColumns);
        setData(tableData);
      }
    });
  }, [navigate]);

  return (
    <>
      <Title level={4} style={{ textAlign: 'center' }}>Report Dashboard</Title>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
        }}
      />
    </>
  );
};

export default IndexPage;
