import React, { useEffect, useRef } from "react";
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'

import { JSONEditor } from "vanilla-jsoneditor";

export const VanillaJSONEditor = (props: any)  => {
  const refContainer = useRef(null);
  const refEditor = useRef(null);

  useEffect(() => {
    // create editor
    console.log("create editor", refContainer.current);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    refEditor.current = new JSONEditor({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      target: refContainer.current,
      props: {}
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        console.log("destroy editor");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      console.log("update props", props);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return <div style={{height: '100%'}} className="jse-theme-dark" ref={refContainer}></div>;
}
