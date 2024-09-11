import React, { useEffect } from "react";
import { Col, Row } from 'antd';
import { Card } from 'antd';
import {serverBaseURL} from '../Utils/config';

const ImageCompare = (props:any) => {

  const { Meta } = Card;
  const urlParams = new URLSearchParams(window.location.search);
  const testCaseID = urlParams.get('id');
  const testReportID = urlParams.get('fileid');
  const baseURL = serverBaseURL;
  const actualResultImagePath = `${baseURL}/download-actual-image/${testReportID}/Actual_Result/${testCaseID}`;
  const expectedResultImagePath = `${baseURL}/download-expected-image/${testReportID}/Expected_Result/${testCaseID}`;
  const style: React.CSSProperties = {  padding: '8px 0'};



  return (
    <div >
      <h2>Result compare</h2>
    <Row gutter={12}>
      <Col className="gutter-row" span={12}>
      <Card
        style={style}
        cover={<img alt="example" src={actualResultImagePath} />}>
        <Meta  description="description" />
      </Card>
      </Col>
      <Col className="gutter-row" span={12}>
      <Card
        style={style}
        cover={<img alt="example" src={expectedResultImagePath} />}>
        <Meta  description="description" />
      </Card>
      </Col>
    </Row>
    </div>
  )
};

export default ImageCompare;
