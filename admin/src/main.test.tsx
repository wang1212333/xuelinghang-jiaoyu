import React from 'react';
import ReactDOM from 'react-dom/client';

function TestApp() {
  return (
    <div style={{
      backgroundColor: '#ff0000',
      color: '#ffffff',
      padding: '40px',
      fontSize: '24px',
      minHeight: '100vh'
    }}>
      <h1>🔴 测试页面 - TEST PAGE</h1>
      <p>如果你能看到这个红色页面，说明 React 正常工作</p>
      <p>If you can see this red page, React is working correctly</p>
      <button onClick={() => alert('按钮工作正常 - Button works!')}>
        测试按钮 - Test Button
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);