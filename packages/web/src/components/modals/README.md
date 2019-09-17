### Props:

В компонент диалога передается prop `close`

`this.props.close()` нужно вызывать когда надо закрыть диалог, при этом всё что было передано первым аргументом окажется значением промиса который был возвращен экшеном открытия диалога.
пример:

```javascript
this.props.close({ someData: {} });
```

### Methods:

При описании модалок можно определять метод `canClose`, который будет вызываться при клике вне зоны диалога (на темный фон).

Есть несколько вариантов использования:

- Запретить закрытие через фон:

```javascript
canClose = () => false;
```

- Делать проверку и показывать окно подтверждения если есть несохраненные данные:

```javascript
canClose = async () => {
  const { openConfirmDialog } = this.props;
  const { isEmpty } = this.props;

  if (!isEmpty) {
    return openConfirmDialog('State will be reset, are you sure?');
  }

  return true;
};
```

Action `openConfirmDialog` из

```javascript
import { openConfirmDialog } from 'store/actions/modals';
```

Необъявленный canClose равносилен функции которая всегда возвращает `true`.
