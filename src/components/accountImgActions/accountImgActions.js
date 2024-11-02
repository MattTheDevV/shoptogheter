import React from 'react';
import './accountImgActions.css';
import Icon from '@mdi/react';
import { mdiLogin,  mdiAccountPlus} from '@mdi/js';

const AccountImgActions = () => {
  return (
    <div className="dropdown">
      <img
        src="/images/account.png"
        className="accountImg dropdown-toggle"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        alt="Account"
        aria-expanded="false"
      />
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>
            <p className='greeting_text'>Hi, {}</p>
        </li>
        <div class="dropdown-divider"></div>
        <li>
            <button className="dropdown-item">
            <Icon path={mdiLogin}
                title="User Profile"
                size={0.8}
                color="#ccc"
                style={{marginRight: "10px"}}
            /> 
            Log In
            </button>
        </li>
        <li>
            <button className="dropdown-item">
            <Icon path={mdiAccountPlus}
                title="User Profile"
                size={0.8}
                color="#ccc"
                style={{marginRight: "10px"}}
            /> 
            Register
            </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountImgActions;
