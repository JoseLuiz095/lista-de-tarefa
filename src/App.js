import FirstComponets from "./img/FirstComponets"
import loading from "./img/loading.svg"
import './App.css';

import {useState,useEffect} from "react"
import{BSTrash,BsBookmarkCheck,BsBookmarkCheckFill} from "react-icons/bs"

const API="http://localhost:5000";

function App() {

  const [title,setTitle]=useState('')
  const [time,setTime]=useState('')
  const [tarefas,setTarefa]=useState([])
  const [loading,setLoading]=useState(false)

  //loanding tarefa on page load
  useEffect(()=>{

    const loadData =async()=>{

      setLoading(true)

      const resp= await fetch(API+"/tarefa")
      .then((resp)=>resp.json())
      .then((data=>data))
      .catch((err)=>console.log(err))
      
      setLoading(false)
      setTarefa(resp)
    }
    loadData()
  },[])
  const handleSubmit = async(e) =>{
    e.preventDefault();
    const tarefa = {
      id:Math.random(),
      title,
      time,
      done:false
    }
    
    await fetch(API +"/tarefa",{
      method:"POST",
      body:JSON.stringify(tarefa),
      headers:{
        "Content-Type":"application/json",
      },
    })

    setTarefa((prevState)=>[...prevState,tarefa])

    setTitle('')
    setTime('')
  }

  if(loading){
    return setTimeout(()=>{
      <div className="loader_container"> 
        <img className="loader" src={loading}></img>
      </div>
    },500)
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
            <input type="text" 
            name="title" 
            placeholder="Titulo da tarefa" 
            onChange={(e) =>setTitle(e.target.value)} 
            value={title || ""}
            required
            />
          </div>

        </form>
      </div>
      <div className="form-tarefa">
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="time">Duração</label>
            <input type="text" 
            name="time" 
            placeholder="Tempo estimado(em horas" 
            onChange={(e) =>setTime(e.target.value)} 
            value={time || ""}
            required
            />
          </div>
          <input type="submit" value="Criar Tarefa" />
        </form>
      </div>
      <div className="list-tarefa">
        <h2>Lista de Tarefa:</h2>
        {tarefas.length === 0 && <p>Não Há tarefas!</p>}
        {tarefas.map((tarefa)=>(
          <div className="tarefa" key={tarefa.id} >
            <p>{tarefa.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
