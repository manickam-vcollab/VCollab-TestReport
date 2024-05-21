import React from "react";
import { Col, Row } from 'antd';
import { Card } from 'antd';

const ImageCompare = (props:any) => {

  const { Meta } = Card;
  const urlParams = new URLSearchParams(window.location.search);
  const testCaseID = urlParams.get('id');
  const actualResultImagePath = 'Actual_Result/'+ testCaseID +'.BMP';
  const expectedResultImagePath = 'Expected_Result/'+ testCaseID +'.BMP';
  const style: React.CSSProperties = {  padding: '8px 0' };

  return (
    <div >
      <h1>Result compare</h1>
    <Row gutter={12}>
      <Col className="gutter-row" span={12}>
      <Card
        style={style}
        cover={<img alt="example" src={actualResultImagePath} />}>
        <Meta title="Input" description="description" />
      </Card>
      </Col>
      <Col className="gutter-row" span={12}>
      <Card
        style={style}
        cover={<img alt="example" src={expectedResultImagePath} />}>
        <Meta title="Output" description="description" />
      </Card>
      </Col>
    </Row>
    </div>
  )
};

export default ImageCompare;
