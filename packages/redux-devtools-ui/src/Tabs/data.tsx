import React from 'react';

const Component = ({ selected }: { selected: string }) => (
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

const selector = (tab: { name: string; value?: string }) => ({
  selected: tab.name,
});

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

export const simple10Tabs: { name: string; value: string }[] = [];
for (let i = 1; i <= 10; i++)
  simple10Tabs.push({ name: `Tab${i}`, value: `${i}` });
