Large
```jsx
const Glyph = require('../Glyph').default;
const Avatar = require('../Avatar').default;

const Tile = require('./Tile').default;
const TileLogo = require('./TileLogo').default;

<div style={{ width: '100%', backgroundColor: '#f3f5fa', padding: 15 }}>
  <TileGrid>
    <TileLogo text="Add token" logo={<Glyph icon="add" />} />
    <TileLogo text="Add friend" logo={<Glyph icon="add" />} />
    <TileLogo
      text="Rey"
      logo={
        <Avatar
          size="large"
          avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
          name="Rey"
        />
      }
    />
    <TileLogo
      text="Elmer Hart"
      logo={
        <Avatar
          size="large"
          avatarUrl="https://randomuser.me/api/portraits/men/18.jpg"
          name="Elmer Hart"
        />
      }
    />
  </TileGrid>
</div>;
```

Medium
```jsx
const Glyph = require('../Glyph').default;
const Avatar = require('../Avatar').default;

const Tile = require('./Tile').default;
const TileLogo = require('./TileLogo').default;

<div style={{ width: '100%', backgroundColor: '#f3f5fa', padding: 15 }}>
  <TileGrid>
    <TileLogo text="Add token" size="medium" logo={<Glyph icon="add" size="medium" />} />
    <TileLogo text="Add friend" size="medium" logo={<Glyph icon="add" size="medium" />} />
    <TileLogo
      text="Debbie Dixon"
      size="medium"
      logo={
        <Avatar avatarUrl="https://randomuser.me/api/portraits/women/29.jpg" name="Debbie Dixon" />
      }
    />
    <TileLogo
      text="Elmer Hart"
      size="medium"
      logo={<Avatar avatarUrl="https://randomuser.me/api/portraits/men/18.jpg" name="Elmer Hart" />}
    />
    <TileLogo
      text="Rey"
      size="medium"
      logo={<Avatar avatarUrl="https://randomuser.me/api/portraits/women/44.jpg" name="Rey" />}
    />
  </TileGrid>
</div>;
```
