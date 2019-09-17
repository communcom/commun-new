```jsx
const ListItem = require('./ListItem').default;
const ListItemText = require('./ListItemText').default;

<div style={{ border: '1px solid #e5e7ed', maxWidth: 200 }}>
  <List>
    <ListItem>
      <ListItemText primary="Java Script" />
    </ListItem>
    <ListItem>
      <ListItemText primary="React" />
    </ListItem>
    <ListItem>
      <ListItemText primary="Redux" />
    </ListItem>
  </List>
</div>;
```

```jsx
const ListItem = require('./ListItem').default;
const ListItemAvatar = require('./ListItemAvatar').default;
const ListItemText = require('./ListItemText').default;

const items = [
  {
    id: 1,
    avatarUrl: 'https://cdn.auth0.com/blog/es6rundown/logo.png',
    primaryText: 'Java Script',
  },
  {
    id: 2,
    avatarUrl: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
    primaryText: 'React',
  },
  {
    id: 3,
    avatarUrl: 'https://devstickers.com/assets/img/pro/h8ci.png',
    primaryText: 'Redux',
  },
];

<div style={{ border: '1px solid #e5e7ed' }}>
  <div>
    <List>
      {items.map(({ id, avatarUrl, primaryText }) => (
        <ListItem key={id} onClick={() => alert(primaryText)}>
          <ListItemAvatar>
            <Avatar avatarUrl={avatarUrl} name={primaryText} />
          </ListItemAvatar>
          <ListItemText primary={primaryText} />
        </ListItem>
      ))}
    </List>
  </div>
</div>;
```

Size: small, medium, large

```jsx
const ListItem = require('./ListItem').default;
const ListItemAvatar = require('./ListItemAvatar').default;
const ListItemText = require('./ListItemText').default;

const items = [
  {
    id: 1,
    avatarUrl: 'https://cdn.auth0.com/blog/es6rundown/logo.png',
    primaryText: 'Java Script',
    secondaryText: '501.4k followers',
  },
  {
    id: 2,
    avatarUrl: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
    primaryText: 'React',
    secondaryText: '12.9k followers',
  },
  {
    id: 3,
    avatarUrl: 'https://devstickers.com/assets/img/pro/h8ci.png',
    primaryText: 'Redux',
    secondaryText: '342 followers',
  },
];

<div style={{ border: '1px solid #e5e7ed', display: 'flex' }}>
  <div>
    <List>
      {items.map(({ id, avatarUrl, primaryText, secondaryText }) => (
        <ListItem size="small" key={id}>
          <ListItemAvatar>
            <Avatar size="small" avatarUrl={avatarUrl} name={primaryText} />
          </ListItemAvatar>
          <ListItemText primaryBold primary={<a href="/">{primaryText}</a>} />
        </ListItem>
      ))}
    </List>
  </div>
  <div>
    <List>
      {items.map(({ id, avatarUrl, primaryText, secondaryText }) => (
        <ListItem key={id}>
          <ListItemAvatar>
            <Avatar avatarUrl={avatarUrl} name={primaryText} />
          </ListItemAvatar>
          <ListItemText
            primaryBold
            primary={<a href="/">{primaryText}</a>}
            secondary={secondaryText}
          />
        </ListItem>
      ))}
    </List>
  </div>
  <div>
    <List>
      {items.map(({ id, avatarUrl, primaryText, secondaryText }) => (
        <ListItem size="large" key={id}>
          <ListItemAvatar>
            <Avatar size="large" avatarUrl={avatarUrl} name={primaryText} />
          </ListItemAvatar>
          <ListItemText
            primaryBold
            primary={<a href="/">{primaryText}</a>}
            secondary={secondaryText}
          />
        </ListItem>
      ))}
    </List>
  </div>
</div>;
```

CommunityItem

```jsx
const CommunityItem = require('./CommunityItem').default;

const items = [
  {
    id: 1,
    avatarUrl: 'https://cdn.auth0.com/blog/es6rundown/logo.png',
    primaryText: 'Java Script',
    secondaryText: '501.4k followers',
  },
  {
    id: 2,
    avatarUrl: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
    primaryText: 'React',
    secondaryText: '12.9k followers',
  },
  {
    id: 3,
    avatarUrl: 'https://devstickers.com/assets/img/pro/h8ci.png',
    primaryText: 'Redux',
    secondaryText: '342 followers',
  },
];

<div style={{ border: '1px solid #e5e7ed', display: 'flex' }}>
  <List>
    {items.map(({ id, avatarUrl, primaryText, secondaryText }) => (
      <CommunityItem
        key={id}
        avatarUrl={avatarUrl}
        primary={primaryText}
        primaryBold
        secondary={secondaryText}
      />
    ))}
  </List>
</div>;
```
