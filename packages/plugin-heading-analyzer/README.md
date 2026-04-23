# plugin-heading-analyzer

Visualise your heading outline structure and identify missing heading levels. Respects WCAG 2.

<img src="https://i.imgur.com/POqtgHu.jpg" alt="example" width="156px" />

## Quick start

```sh
npm i @frontend/plugin-heading-analyzer
```

```jsx
import { Editor } from "@frontend/core";
import headingAnalyzer from "@frontend/plugin-heading-analyzer";
import "@frontend/plugin-heading-analyzer/dist/index.css";

...

// Render Frontend
export function Page() {
  return <Editor
    config={config}
    data={data}
    plugins={[
        headingAnalyzer
    ]}
  />;
}
```

## License

MIT © [The Frontend Contributors](https://github.com/editoreditor/editor/graphs/contributors)
