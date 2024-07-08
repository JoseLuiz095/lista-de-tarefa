import './App.css';
import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";
import loadingSvg from './img/loading.svg';

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [tarefas, setTarefas] = useState([]); // Inicializando como um array vazio
  const [loading, setLoading] = useState(false);

  // Carregar tarefas na carga da página
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const resp = await fetch(API + "/tarefa");
        const data = await resp.json();
        setTarefas(data || []); // Certifique-se de que `data` é um array
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tarefa = {
      id: Math.random(),
      title,
      time,
      done: false
    };


    await fetch(API + "/tarefa", {
      method: "POST",
      body: JSON.stringify(tarefa),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTarefas((prevState) => [...prevState, tarefa]);
    setTitle('');
    setTime('');

  };
  const handleDelete = async(id) => {
    await fetch(API + "/tarefa/" + id, {
      method: "DELETE",
    });
    setTarefas((prevState) => prevState.filter((tarefas) => tarefas.id !== id))
};

const handleEdit = async (tarefa) => {

  tarefa.done = !tarefa.done

  const data = await fetch(API + "/tarefa/" + tarefa.id, {
    method: "PUT",
    body: JSON.stringify(tarefa),
    headers: {
      "Content-Type": "application/json",
    },
  })
  setTarefas((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)))
}


if (loading) {
  return (
    <div className="loader_container">
      <img className='loader' src={loadingSvg} alt="Loading..." />
    </div>
  );
}

return (
  <div className="App">
    <div className="tarefa-header">
      <h1>Lista de Tarefa</h1>
      <h4>React</h4>
    </div>
    <div className="form-tarefa">
      <h2>Insira a sua próxima tarefa:</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="title">O que você vai fazer?</label>
          <input
            type="text"
            name="title"
            placeholder="Titulo da tarefa"
            onChange={(e) => setTitle(e.target.value)}
            value={title || ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="time">Duração</label>
          <input
            type="text"
            name="time"
            placeholder="Tempo estimado (em horas)"
            onChange={(e) => setTime(e.target.value)}
            value={time || ""}
            required
          />
        </div>
        <input type="submit" value="Criar Tarefa" />
      </form>
    </div>
    <div className="list-tarefa">
      <h2>Lista de Tarefa:</h2>
      {tarefas.length === 0 && <p>Não há tarefas!</p>}
      {tarefas.map((tarefa) => (
        <div className="tarefa" key={tarefa.id}>
          <h3 className={tarefa.done ? "tarefa-done" : ""}>{tarefa.title}</h3>
          <p>Duração: {tarefa.time}</p>
          <div className='action'>
            <span onClick={() => handleEdit(tarefa)}>
              {!tarefa.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
            </span>
            <BsTrash onClick={() => handleDelete(tarefa.id)} />
          </div>

        </div>
      ))}
    </div>
  </div>
);
}

export default App
