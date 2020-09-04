import React from 'react';

/* eslint-disable react/prop-types */
const Component = ({ selected }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      fontSize: '22px',
    }}
  >
    Selected {selected}
  </div>
);
/* eslint-enable react/prop-types */

const selector = (tab) => ({ selected: tab.name });

export const tabs = [
  {
    name: 'Tab1',
    component: Component,
    selector,
  },
  {
    name: 'Tab2',
    component: Component,
    selector,
  },
  {
    name: 'Tab3',
    component: Component,
    selector,
  },
];

export const simple10Tabs = [];
for (let i = 1; i <= 10; i++)
  simple10Tabs.push({ name: `Tab${i}`, value: `${i}` });
