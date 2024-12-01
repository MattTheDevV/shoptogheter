import React from 'react';
import './topbar.css';
import AccountImgActions from '../accountImgActions/accountImgActions';

const Topbar = () => {
  return (
    <div className="wrapper">
        <div className="topbar">
            <h1>
                ShopTogether
            </h1>
            <AccountImgActions/>
        </div>
    </div>
  );
};

export default Topbar;
