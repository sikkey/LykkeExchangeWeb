import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {MouseEventHandler} from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_TRANSFER_FROM, ROUTE_TRANSFER_TO} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import {copyTextToClipboard} from '../../utils/index';
import './style.css';

interface WalletActionBarProps extends RootStoreProps {
  wallet: WalletModel;
}

export class WalletActionBar extends React.Component<WalletActionBarProps> {
  state = {message: ''};

  render() {
    const {wallet} = this.props;
    return (
      <div className="wallet-action-bar">
        <div className="wallet-action-bar__item">
          <Link to={ROUTE_TRANSFER_TO(wallet.id)}>Deposit</Link>
        </div>
        <div className="wallet-action-bar__item">
          <Link to={ROUTE_TRANSFER_FROM(wallet.id)}>Withdraw</Link>
        </div>
        {wallet.apiKey && (
          <div
            className={classNames(
              'wallet-action-bar__item',
              'wallet-action-bar__item--key',
              'pull-right'
            )}
          >
            {!!this.state.message && (
              <small
                style={{
                  color: 'green',
                  fontWeight: 'normal',
                  paddingRight: '1em'
                }}
              >
                {this.state.message}
              </small>
            )}
            <a
              onClick={this.handleClickApiKey}
              title="Click to copy your API Key"
            >
              API Key
            </a>
          </div>
        )}
      </div>
    );
  }

  private handleClickApiKey: MouseEventHandler<any> = e => {
    const copyResult = copyTextToClipboard(this.props.wallet.apiKey);
    if (copyResult) {
      this.setState({message: 'API key copied to clipboard'});
      setTimeout(() => {
        this.setState({message: ''});
      }, 2000);
    }
  };
}

export default inject(STORE_ROOT)(observer(WalletActionBar));
