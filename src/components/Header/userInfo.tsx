import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import Dropdown, {
  DROPDOWN_TRIGGER,
  DropdownItem,
  DropdownOverlay
} from '../Dropdown';

export const UserInfo: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {authStore, profileStore} = rootStore!;

  return (
    <div className="header__actions header_actions__login header_login pull-right">
      <Dropdown
        overlay={
          <DropdownOverlay>
            <DropdownItem onClick={authStore.logout}>Sign out</DropdownItem>
          </DropdownOverlay>
        }
        trigger={[DROPDOWN_TRIGGER.HOVER]}
      >
        <div className="header_user dropdown__control">
          <div className="header_user__img">
            <img
              src={`${process.env.PUBLIC_URL}/images/user_default.svg`}
              width="40"
              alt="user_image"
            />
          </div>
          <div className="header_login__title">{profileStore.fullName}</div>
        </div>
      </Dropdown>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(UserInfo));
