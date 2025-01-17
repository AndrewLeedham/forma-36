import React from 'react';

import Highlight, {
  defaultProps as HighlightDefaultProps,
} from 'prism-react-renderer';
import { theme } from 'react-live/src/constants/theme';

export function StaticSource(props) {
  return (
    <Highlight
      {...HighlightDefaultProps}
      theme={theme}
      code={props.children.trim()}
      language={(props.className || '').replace('language-', '')}
    >
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className="f36-padding--m">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
