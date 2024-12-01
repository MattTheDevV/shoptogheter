import React from 'react';
import './accountImgActions.css';
import Icon from '@mdi/react';
import { mdiLogin,  mdiAccountPlus, mdiAccountReactivate} from '@mdi/js';
import { useUser} from '../../providers/userProvider';

const AccountImgActions = () => {
  const {currentUser, changeUser} = useUser()

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
            <p className='greeting_text'>Hi, {currentUser}</p>
        </li>
        <div class="dropdown-divider"></div>
        <li>
            <button className="dropdown-item" onClick={() => changeUser("user1")}>
            <Icon path={mdiAccountReactivate}
                title="User Profile"
                size={0.8}
                color="#ccc"
                style={{marginRight: "10px"}}
            /> 
            User1
            </button>
        </li>
        <li>
            <button className="dropdown-item" onClick={() => changeUser("user2")}>
            <Icon path={mdiAccountReactivate}
                title="User Profile"
                size={0.8}
                color="#ccc"
                style={{marginRight: "10px"}}
            /> 
             User2
            </button>
        </li>
        <li>
            <button className="dropdown-item" onClick={() => changeUser("user3")}>
            <Icon path={mdiAccountReactivate}
                title="User Profile"
                size={0.8}
                color="#ccc"
                style={{marginRight: "10px"}}
            /> 
             User3
            </button>
        </li>
        <li>
            <button className="dropdown-item" onClick={() => changeUser("user4")}>
            <Icon path={mdiAccountReactivate}
                title="User Profile"
                size={0.8}
                color="#ccc"
                style={{marginRight: "10px"}}
            /> 
             User4
            </button>
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
