# any-touch
一个手势库 

## 安装
```
npm i -S any-touch
```

## 使用
```javascript
import AnyTouch from 'any-touch';
const el = doucument.getElementById('gesture-box');
const at = new AnyTouch(el);

at.on('pan', anyTouchEvent=>{
  console.log(anyTouchEvent.deltaX);
})
```

### 已完成
- [x] 支持手势: tap | doubletap | pan | swipe | pinch | rotate.
- [x] 支持鼠标(mouse)
- [x] 手势互斥(requireFailure)

### 待完成
- [ ] 识别input数据变形(transform)
- [ ] 自定义识别器(recgnizer)
- [ ] 停止继续识别(stop)
- [ ] 自定义任意触点,让鼠标支持rotate和pinch(addPointer)
- [ ] 单元测试(test)
