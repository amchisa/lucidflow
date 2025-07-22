import { useState } from "react";

interface PostFormProps {
  onClose: () => void;
  onSubmit: (title: string, body: string) => void;
  initialTitle?: string;
  initialBody?: string;
}

export default function PostForm({
  onClose,
  onSubmit,
  initialTitle = "",
  initialBody = "",
}: PostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (title.trim().length === 0 || body.trim().length === 0) {
      return;
    }

    onSubmit(title, body);
    setTitle("");
    setBody("");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Give your post a title"
      ></input>
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Give your post a body"
      ></input>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
