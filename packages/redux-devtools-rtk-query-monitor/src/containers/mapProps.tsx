import React, { ComponentType, ReactNode, Component } from 'react';

interface Mapper<In, Out> {
  (inProps: In): Out;
}

interface MapPropsOutput<In, Out> {
  (comp: ComponentType<Out>): ComponentType<In>;
}

export function mapProps<In, Out>(
  mapper: Mapper<In, Out>,
): MapPropsOutput<In, Out> {
  return function mapPropsHoc(Comp) {
    class MapPropsHoc extends Component<In> {
      render(): ReactNode {
        const mappedProps = mapper(this.props);

        // TODO Not really sure why this is needed, but it is
        return <Comp {...(mappedProps as any)} />;
      }

      static displayName = `mapProps(${
        Comp.displayName || Comp.name || 'Component'
      })`;
    }

    return MapPropsHoc;
  };
}
