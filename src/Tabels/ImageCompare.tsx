import React from "react";
import { Col, Row } from 'antd';
import { Card } from 'antd';

const ImageCompare = (props:any) => {

  const { Meta } = Card;
  const urlParams = new URLSearchParams(window.location.search);
  const testCaseID = urlParams.get('id');
  const actualResultImagePath = 'Actual_Result/'+ testCaseID +'.png';
  const expectedResultImagePath = 'Expected_Result/'+ testCaseID +'.png';

  return (
    <div>
      <h1>Result compare</h1>
      <Row>
      <Col span={12}>
      <Card
        cover={<img alt="example" src={actualResultImagePath} />}>
        <Meta title="Actual Result" description="description" />
      </Card>
      </Col>
      <Col span={12}>
      <Card
        cover={<img alt="example" src={expectedResultImagePath} />}>
        <Meta title="Expected Result" description="description" />
      </Card>
      </Col>
    </Row>
    </div>
  )
};

export default ImageCompare;
