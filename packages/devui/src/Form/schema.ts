import { JSONSchema7 } from 'json-schema';

export const schema: JSONSchema7 = {
  title: 'Example form',
  description: 'A simple form example.',
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Full name',
    },
    age: {
      type: 'integer',
      title: 'Age',
    },
    bio: {
      type: 'string',
      title: 'Bio',
    },
    password: {
      type: 'string',
      title: 'Password',
      minLength: 3,
    },
    multipleChoicesList: {
      type: 'array',
      title: 'A multiple choices list',
      items: {
        type: 'string',
        enum: ['foo', 'bar', 'fuzz'],
      },
      uniqueItems: true,
    },
    numberEnum: {
      type: 'number',
      title: 'Number enum',
      enum: [1, 2, 3],
    },
    numberEnumRadio: {
      type: 'number',
      title: 'Number enum',
      enum: [1, 2, 3],
    },
    integerRange: {
      title: 'Integer range',
      type: 'integer',
      minimum: 42,
      maximum: 100,
    },
  },
};

export const uiSchema = {
  name: {
    'ui:autofocus': true,
  },
  age: {
    'ui:widget': 'updown',
  },
  bio: {
    'ui:widget': 'textarea',
  },
  password: {
    'ui:widget': 'password',
    'ui:help': 'Hint: Make it strong!',
  },
  date: {
    'ui:widget': 'alt-datetime',
  },
  multipleChoicesList: {
    'ui:widget': 'checkboxes',
  },
  numberEnumRadio: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true,
    },
  },
  integerRange: {
    'ui:widget': 'range',
  },
};

export const formData = {
  name: 'Chuck Norris',
  age: 75,
  bio: 'Roundhouse kicking asses since 1940',
  password: 'noneed',
  integerRange: 52,
};
