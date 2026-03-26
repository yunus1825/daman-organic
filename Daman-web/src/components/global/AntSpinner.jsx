import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
      color: '#fff', // Set your desired color here
    }}
    spin
  />
);

export const MySpinner = () => <Spin indicator={antIcon} />;
