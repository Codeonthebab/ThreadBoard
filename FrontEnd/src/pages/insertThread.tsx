import React from 'react';

function insertThread() {
  return (
    <div>
      <h1>Create a New Thread</h1>
      {/* 여기에 새 스레드를 만드는 폼을 추가할 수 있습니다. */}
      <form>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content"></textarea>
        </div>
        <button type="submit">Create Thread</button>
      </form>
    </div>
  );
}

export default insertThread;