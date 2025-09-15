import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function insertThread() {

  const handleSubmit = (e) => {}
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div>
      <h1>Create a New Thread</h1>
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