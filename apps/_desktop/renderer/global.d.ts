// global.d.ts

// 扩展 Window 接口
interface Window {
    electronAPI: {
      changeView: (viewName: string) => void;
    };
  }