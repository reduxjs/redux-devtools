export const formSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Template name'
    },
    dispatcher: {
      type: 'string',
      title: 'Dispatcher: ({ action, prevState }) => (`<template>`)'
    },
    assertion: {
      type: 'string',
      title: 'Assertion: ({ curState }) => (`<template>`)'
    },
    wrap: {
      type: 'string',
      title: 'Wrap code: ({ name, initialState, assertions }) => (`<template>`)'
    }
  }
};

export const uiSchema = {
  dispatcher: {
    'ui:widget': 'textarea'
  },
  assertion: {
    'ui:widget': 'textarea'
  },
  wrap: {
    'ui:widget': 'textarea'
  }
};

export const defaultFormData = {
  dispatcher: 'state = reducers(${prevState}, ${action});',
  assertion: 't.deepEqual(state, ${curState});',
  wrap: `test('reducers', (t) => {
  \${assertions}
});`
};
