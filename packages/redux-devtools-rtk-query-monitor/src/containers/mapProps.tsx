import React, { ComponentType, ReactNode, Component } from 'react';

interface Mapper<In, Out> {
  (inProps: In): Out;
}

interface MapPropsOutput<In, Out> {
  (comp: ComponentType<Out>): ComponentType<In>;
}

export function mapProps<In, Out>(
  mapper: Mapper<In, Out>
): MapPropsOutput<In, Out> {
  return function mapPropsHoc(Comp) {
    class MapPropsHoc extends Component<In> {
      render(): ReactNode {
        const mappedProps = mapper(this.props);

        return <Comp {...mappedProps} />;
      }

      static displayName = `mapProps(${
        Comp.displayName || Comp.name || 'Component'
      })`;
    }

    return MapPropsHoc;
  };
}
