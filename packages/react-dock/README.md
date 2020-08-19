# react-dock

Resizable dockable react component.

#### Demo

[http://alexkuz.github.io/react-dock/demo/](http://alexkuz.github.io/react-dock/demo/)

#### Install

```
$ npm i -S react-dock
```

#### Example

```jsx
render() {
  return (
    <Dock position='right' isVisible={this.state.isVisible}>
      {/* you can pass a function as a child here */}
      <div onClick={() => this.setState({ isVisible: !this.state.isVisible })}>X</div>
    </Dock>
  );
}
```

#### Dock Props

| Prop Name       | Description                                                                                                                                                                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| position        | Side to dock (`left`, `right`, `top` or `bottom`). Default is `left`.                                                                                                                                                                                                             |
| fluid           | If `true`, resize dock proportionally on window resize.                                                                                                                                                                                                                           |
| size            | Size of dock panel (width or height, depending on `position`). If this prop is set, `Dock` is considered as a controlled component, so you need to use `onSizeChange` to track dock resizing. Value is a fraction of window width/height, if `fluid` is true, or pixels otherwise |
| defaultSize     | Default size of dock panel (used for uncontrolled `Dock` component)                                                                                                                                                                                                               |
| isVisible       | If `true`, dock is visible                                                                                                                                                                                                                                                        |
| dimMode         | If `none` - content is not dimmed, if `transparent` - pointer events are disabled (so you can click through it), if `opaque` - click on dim area closes the dock. Default is `opaque`                                                                                             |
| duration        | Animation duration. Should be synced with transition animation in style properties                                                                                                                                                                                                |
| dimStyle        | Style for dim area                                                                                                                                                                                                                                                                |
| dockStyle       | Style for dock                                                                                                                                                                                                                                                                    |
| zIndex          | Z-index for wrapper                                                                                                                                                                                                                                                               |
| onVisibleChange | Fires when `Dock` wants to change `isVisible` (when opaque dim is clicked, in particular)                                                                                                                                                                                         |
| onSizeChange    | Fires when `Dock` wants to change `size`                                                                                                                                                                                                                                          |
| children        | Dock content - react elements or function that returns an element. Function receives an object with these state values: `{ position, isResizing, size, isVisible }`                                                                                                               |
