not completed yet

```jsx
const items = [
  {
    label: 'Java Script',
    value: 'javascript',
  },
  {
    label: 'React',
    value: 'react',
  },
  {
    label: 'Redux',
    value: 'redux',
  },
];

<div style={{ width: 350 }}>
  <Dropdown items={items} onSelect={value => console.log(value)} />
</div>;
```
