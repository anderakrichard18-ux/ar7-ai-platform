"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
  }

  async function addTask() {
    if (!title.trim()) return;

    const { error } = await supabase
      .from("tasks")
      .insert([{ title }]);

    if (!error) {
      setTitle("");
      loadTasks();
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-black text-white">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          AR7 TASK SYSTEM
        </h1>

        <div className="flex gap-3 mb-8">

          <input
            type="text"
            placeholder="Nova tarefa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-4 rounded-xl text-black"
          />

          <button
            onClick={addTask}
            className="bg-green-500 px-6 rounded-xl font-bold"
          >
            Adicionar
          </button>

        </div>

        <div className="space-y-4">

         {tasks.map((task) => (
  <div
    key={task.id}
    className="border border-gray-700 p-4 rounded-xl flex items-center justify-between"
  >
    <div className="flex items-center gap-3">

      <input
        type="checkbox"
        checked={task.completed}
        onChange={async () => {
          await supabase
            .from("tasks")
            .update({
              completed: !task.completed,
            })
            .eq("id", task.id);

          loadTasks();
        }}
      />

      <span
        className={
          task.completed
            ? "line-through text-gray-500"
            : ""
        }
      >
        {task.title}
      </span>

    </div>

    <button
      onClick={async () => {
        await supabase
          .from("tasks")
          .delete()
          .eq("id", task.id);

        loadTasks();
      }}
      className="text-red-500"
    >
      🗑
    </button>
  </div>
))}
        </div>
      </div>
    </main>
  );
}
