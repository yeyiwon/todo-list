import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { TodoItem } from "@/types";

export default function Home() {
  const tenantId = 'yeyiwon';
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [dones, setDones] = useState<TodoItem[]>([]);

  const loadTodos = async () => {
    try {
      const response = await axios.get(
        `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`
      );
      const allTodos = response.data;

      const falseTodos = allTodos.filter((todo: TodoItem) => !todo.isCompleted);
      const completedTodos = allTodos.filter((todo: TodoItem) => todo.isCompleted);

      setTodos(falseTodos);
      setDones(completedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const AddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim() === "") return;

    try {
      const response = await axios.post<TodoItem>(
        `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`,
        { name: input }
      );
      setTodos([...todos, response.data]);
      setInput("");
    } catch (error) {
      console.error(error);
    }
  };

  const completeTodo = async (id: number) => {
    try {
        const todoToUpdate = todos.find(todo => todo.id === id) || dones.find(done => done.id === id);
        if (!todoToUpdate) return;
        
        await axios.patch(
            `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${id}`,
            { isCompleted: !todoToUpdate.isCompleted }
        );

        loadTodos();
    } catch (error) {
        console.error(error);
    }
}

  return (
    <div className="container">
      <form onSubmit={AddTodo}>
        <div className="todo_inputArea">
          <input
            type="text"
            value={input}
            onChange={InputChange}
            placeholder="할 일을 입력해주세요"
          />
          <button
            className="AddTodoBtn"
            disabled={input.trim() === ''}
          >
            <Image
              src={input.trim() === '' ? "/images/plusgray.png" : "/images/pluswhite.png"}
              alt=""
              width={16}
              height={16}
            />
            <span>추가하기</span>
          </button>
        </div>
      </form>

      <div className="TodoList_wrap">
        <div className="TodoList">
          <Image
            src="/images/todo.png"
            alt="todo"
            width={101}
            height={36}
          />
          {
            todos.length === 0 ? (
              <div className="empty">
                <Image
                  src="/images/TodoLarge.png"
                  alt="todoempty"
                  width={240}
                  height={240}
                />
                <p> 할 일이 없어요. <br />
                  TODO를 새롭게 추가해주세요!
                </p>
              </div>
            ) : (
              <div>
                <ul className="List_ul">
                  {todos.map((todo) => (
                    <li key={todo.id} className="Todoitem">
                      <Image
                        onClick={() => completeTodo(todo.id)} 
                        src="/images/PropertyDefault.png"
                        alt="todoempty"
                        width={32}
                        height={32}
                      />
                      <Link href={`/items/${todo.id}`}>
                        {todo.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
        </div>

        <div className="DoneList">
          <Image
            src="/images/done.png"
            alt="done"
            width={101}
            height={36}
          />
          {
            dones.length === 0 ? (
              <div className="empty">
                <Image
                  src="/images/DoneLarge.png"
                  alt="Doneempty"
                  width={240}
                  height={240}
                />
                아직 다 한 일이 없어요. <br />
                해야 할 일을 체크해보세요!
              </div>
            ) : (
              <ul className="List_ul">
                {dones.map((done) => (
                  <li key={done.id} className="Todoitem Done">
                    <Image
                      onClick={() => completeTodo(done.id)}
                      src="/images/PropertyDone.png"
                      alt="todoempty"
                      width={32}
                      height={32}
                    />
                    <Link href={`/items/${done.id}`}>
                      {done.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )
          }
        </div>
      </div>
    </div>
  );
}
