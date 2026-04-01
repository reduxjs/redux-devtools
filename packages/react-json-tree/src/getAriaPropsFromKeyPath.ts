import { KeyPath } from "./types.js";

const replaceSpacesRegex = / /g;

const getAriaPropsFromKeyPath = (
    keyPath: KeyPath
) => {
    let ariaControls = '';
    let ariaLabel = 'JSON Tree Node: ';
    for(let i = keyPath.length - 1; i >= 0; i--) {
        const key = keyPath[i];
        ariaControls += `${key}`.replace(replaceSpacesRegex, '-');
        ariaLabel += `${key} `;
    }

    ariaLabel = ariaLabel.trim();

    return { ariaControls, ariaLabel };
}

export default getAriaPropsFromKeyPath;