import { Template } from './types';

export const formSchema = {
  type: 'object' as const,
  required: ['name'],
  properties: {
    name: {
      type: 'string' as const,
      title: 'Template name',
    },
    dispatcher: {
      type: 'string' as const,
      title: 'Dispatcher: ({ action, prevState }) => (`<template>`)',
    },
    assertion: {
      type: 'string' as const,
      title: 'Assertion: ({ curState }) => (`<template>`)',
    },
    wrap: {
      type: 'string' as const,
      title:
        'Wrap code: ({ name, initialState, assertions }) => (`<template>`)',
    },
  },
};

export const uiSchema = {
  dispatcher: {
    'ui:widget': 'textarea',
  },
  assertion: {
    'ui:widget': 'textarea',
  },
  wrap: {
    'ui:widget': 'textarea',
  },
};

export const defaultFormData: Template = {
  dispatcher: 'state = reducers(${prevState}, ${action});',
  assertion: 't.deepEqual(state, ${curState});',
  wrap: `test('reducers', (t) => {
  \${assertions}
});`,
};
