import React, { useState, useEffect } from 'react';
import { Dropdown } from 'carbon-components-react';
import { useSubstrate } from '../substrate-lib';

function Main (props) {
  const { keyring } = useSubstrate();

  // Get accounts list
  const keyringOptions = keyring.getPairs().map(account => ({
    id: account.address,
    text: account.meta.name.toUpperCase(),
  }));

  let initialAddress = null;
  let initialItem = {};
  if (localStorage.getItem('initialAddress') == null) {
    initialAddress = keyringOptions.length > 0 ? keyringOptions[0].id : '';
    initialItem = keyringOptions.length > 0 ? keyringOptions[0] : {};
    localStorage.setItem('initialAddress', initialAddress);
    localStorage.setItem('initialItem', JSON.stringify(initialItem));
    
  } else {
    initialAddress = localStorage.getItem('initialAddress');
    initialItem = JSON.parse(localStorage.getItem('initialItem'));
  }
  const [accountSelected, setAccountSelected] = useState(initialAddress);
  const [currentOption, setCurrentOptionSelected] = useState(initialItem);

  // Set the initial address
  useEffect(() => {
    props.sendAddressData(initialAddress);
  }, [initialAddress]);

  const onChange = (event) => {
    localStorage.setItem('initialAddress', event.selectedItem.id);
    localStorage.setItem('initialItem', JSON.stringify(event.selectedItem));
    setAccountSelected(event.selectedItem.id);
    setCurrentOptionSelected(event.selectedItem);
    props.sendAddressData(event.selectedItem.id);
  };
  
  return (
    <div>
      { !accountSelected
        ? <span>
          Add your account with the{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://github.com/polkadot-js/extension'
          >
            Polkadot JS Extension
          </a>
        </span>
        : null }
      <Dropdown
        id="inline"
        type="inline"
        label="Select an account"
        items={keyringOptions}
        selectedItem={currentOption}
        itemToString={(keyringOption) => (keyringOption ? keyringOption.text : '')}
        onChange={onChange}
      />
    </div>
  );
}

export default function AccountSelector (props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}
