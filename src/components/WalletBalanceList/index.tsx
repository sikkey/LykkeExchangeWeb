import {observer} from 'mobx-react';
import * as React from 'react';
import {ROUTE_TRANSFER_FROM, ROUTE_TRANSFER_TO} from '../../constants/routes';
import {WalletModel} from '../../models/index';
import {plural} from '../../utils';
import Dropdown, {DropdownItem} from '../Dropdown';
import {asAssetBalance, asBalance} from '../hoc/assetBalance';
import {IconButton} from '../Icon';
import styled from '../styled';
import './style.css';

const assetIcon = {
  BTC: 'bitcoin.png',
  ETH: 'icon-eth.svg',
  LKK: 'icon-lkk.svg',
  LKK1Y: 'icon-lkk-1-y.svg',
  SLR: 'icon-slr.svg',
  TIME: 'icon-time.svg',
  TREE: 'icon-tree.svg',
  // tslint:disable-next-line:object-literal-sort-keys
  EUR: 'eur-lykke.png',
  USD: 'usd-lykke.png',
  CHF: 'franc-lykke.png'
};

const assetIconUrl = (asset: string) =>
  `${process.env.PUBLIC_URL}/images/assets/${assetIcon[asset.toUpperCase()] ||
    'asset_default.jpg'}`;

interface WalletBalanceListProps {
  wallet: WalletModel;
}

const Uppercase = styled.div`
  text-transform: uppercase;
`;

export const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet
}) => (
  <div className="wallet__balances">
    {wallet.hasBalances || (
      <small style={{margin: 0}}>You don’t have any asset yet</small>
    )}
    {wallet.hasBalances &&
      Object.keys(wallet.getBalancesByCategory).map(x => {
        const balances = wallet.getBalancesByCategory[x];
        return (
          <div key={x}>
            <h3>
              {x}
              <small>
                {balances.length} {plural(balances.length, 'asset')}
              </small>
            </h3>
            <table className="table_assets">
              <thead>
                <tr>
                  <th className="_asset">Asset</th>
                  <th className="_currency">Base currency</th>
                  <th className="_amount">Amount</th>
                  <th className="_action">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {balances.map(b => (
                  <tr key={b.assetId + b.balance}>
                    <td className="_asset">
                      <div className="issuer">
                        <div className="issuer__img">
                          <img
                            src={assetIconUrl(b.asset.name)}
                            alt="asset"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="issuer__content">
                          <div className="issuer__name">{b.asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="_currency">
                      {asAssetBalance(b.baseAsset!, b.balanceInBaseAsset)}{' '}
                      {b.baseAsset!.name}
                    </td>
                    <td className="_amount">
                      {asBalance(b)} {b.asset.name}
                    </td>
                    <td className="_action">
                      <Dropdown
                        content={
                          <Uppercase>
                            <DropdownItem to={ROUTE_TRANSFER_TO(wallet.id)}>
                              Deposit
                            </DropdownItem>
                            <DropdownItem to={ROUTE_TRANSFER_FROM(wallet.id)}>
                              Withdraw
                            </DropdownItem>
                          </Uppercase>
                        }
                        isOnClick={true}
                      >
                        <IconButton name="actions" />
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
  </div>
);

export default observer(WalletBalanceList);
