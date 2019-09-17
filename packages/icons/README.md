## Icons package

### Generated folder

Folder for generated from svg react components. **Required!**

### Usage

**With Sprite**

In your app root:

```javascript
import { Sprite } from '@commun/icons';

...

<Root>
  <Sprite />
  <YourAnyComponent />
</Root>

...

```

In place where you need the icon:

```javascript
import { Icon } from '@commun/icons';

...

<Icon name="your-icon-name (without -icon postfix)" size={yourIconSize} />

...

```

**Just component**

```javascript
import { AnyIcon } from '@commun/icons';

...

<AnyIcon />

...

```

**Warning: all passed props which cannot be converted in valid HTML(SVG) attributes will be removed!**
