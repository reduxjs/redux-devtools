A pure function to convert a map into a tree structure.

The following opinions must be taken into account since the primary use case of this library is [redux-devtools-chart-monitor](https://github.com/romseguy/redux-devtools-chart-monitor):

- Objects and arrays deeply nested within collections are not converted into a tree structure. See `someNestedObject` and `someNestedArray` in the [output](https://github.com/romseguy/map2tree#output) below, or the [corresponding test](https://github.com/romseguy/map2tree/blob/master/test/map2tree.js#L140).
- Provides support for [Immutable.js](https://github.com/facebook/immutable-js) data structures (only List and Map though).


# Usage


```javascript
map2tree(someMap, options = {
  key: 'state',      // the name you want for as the root node of the output tree
  pushMethod: 'push' // use 'unshift' to change the order children nodes are added
})
```

# Input

```javascript
const someMap = {
  someReducer: {
    todos: [
     {title: 'map', someNestedObject: {foo: 'bar'}},
     {title: 'to', someNestedArray: ['foo', 'bar']},
     {title: 'tree'},
     {title: 'map2tree'}
    ],
    completedCount: 1
  },
  otherReducer: {
    foo: 0,
    bar:{key: 'value'}
  }
};
```

# Output

```javascript
{
  name: `${options.key}`,
  children: [
    {
      name: 'someReducer',
      children: [
        {
          name: 'todos',
          children: [
            {
              name: 'todo[0]',
              object: {
                title: 'map',
                someNestedObject: {foo: 'bar'}
              }
            },
            {
              name: 'todo[1]',
              object: {
                title: 'to',
                someNestedArray: ['foo', 'bar']
              }
            },
            // ...
          ]
        },
        // ...
      ]
    },
    {
      name: 'otherReducer',
      children: [
        {
          name: 'foo',
          value: 0
        },
        {
          name: 'bar',
          object: {
            key: 'value'
          }
        }
      ]
    }
  ]
}
```
