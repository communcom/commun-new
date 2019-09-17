```jsx
const items = ['Javascript', 'React', 'Redux'];

class InputWithDropdownPreview extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      isDropDownOpen: false,
    };
    this.changeInputHandler = this.changeInputHandler.bind(this);
    this.selectValueHandler = this.selectValueHandler.bind(this);
  }

  changeInputHandler(e) {
    this.setState({
      inputValue: e.target.value,
      isDropdownOpen: Boolean(e.target.value),
    });
  }

  selectValueHandler(value) {
    this.setState({
      inputValue: value,
      isDropdownOpen: false,
    });
  }

  render() {
    const { isDropdownOpen, inputValue } = this.state;
    return (
      <div style={{ width: 350 }}>
        <InputWithDropdown
          items={items}
          isDropdownOpen={isDropdownOpen}
          inputValue={inputValue}
          changeInputHandler={this.changeInputHandler}
          selectValueHandler={this.selectValueHandler}
        />
      </div>
    );
  }
}

<InputWithDropdownPreview />;
```
