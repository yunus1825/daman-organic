// src/hocs/withAccountLayout.jsx
import React, { useState } from 'react';
import ProfileLayout from '../pages/Profile/components/ProfileLayout';

export default function withProfileLayout(WrappedComponent) {
  return function ProfilePageWrapper(props) {
    // manage which tab is active
    const [active, setActive] = useState('cart');

    return (
      <ProfileLayout active={active} onSelect={setActive}>
        {/* pass active into your wrapped component so it can render the right content */}
        <WrappedComponent active={active} {...props} />
      </ProfileLayout>
    );
  };
}
