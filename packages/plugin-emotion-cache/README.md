# plugin-emotion-cache

Inject [emotion cache](https://emotion.sh/docs/@emotion/cache) into the Frontend iframe.

## Quick start

```sh
npm i @frontend/plugin-emotion-cache
```

```jsx
import { Editor } from "@frontend/core";
import createEmotionCache from "@frontend/plugin-emotion-cache";

// Create your emotion cache plugin. This example configures it for Chakra.
const chakraEmotionCache = createEmotionCache("cha");

// Render Frontend
export function Page() {
  return <Editor config={config} data={data} plugins={[chakraEmotionCache]} />;
}
```

## Args

| Param         | Example | Type   | Status   |
| ------------- | ------- | ------ | -------- |
| [`key`](#key) | `cha`   | String | Required |

### Required args

#### `key`

Key to pass to Emotion's [`createCache` method](https://emotion.sh/docs/@emotion/cache#createcache).

## License

MIT © [The Frontend Contributors](https://github.com/editoreditor/editor/graphs/contributors)
