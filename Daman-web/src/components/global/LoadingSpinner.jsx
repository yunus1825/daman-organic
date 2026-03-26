import { Spin } from 'antd';

const LoadingSpinner = ({ size = 'large' }) => {
  const spinnerSize = size === 'large' ? 'text-5xl' : 'text-3xl';

  return (
    <div className="animate-spin text-primary">
      <Spin className={spinnerSize} />
    </div>
  );
};

export default LoadingSpinner;
