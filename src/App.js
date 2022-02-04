import { useState, useEffect } from 'react';
import axios from 'axios';
 
import './App.css';


function App() {

  const [indicators, setIndicators] = useState({});
  const [sim, setSim] = useState({});
  const [result, setResult] = useState(false);
  const [revenue, setRevenue] = useState('gross');
  const [index, setIndex] = useState('post');
  const [deadline, setDeadline] = useState(0);
  const [fstContribution, setFirstContribution] = useState(0);
  const [mthContribution, setMthContribution] = useState(0);
  const [profit, setProfit] = useState(0);
  
  useEffect(() => {
    
    const apiIndices = async () => {
      const response = await axios.get('http://localhost:3000/indicadores')
      setIndicators(response.data);

    };
    const apiSim = async () => {
      const response = await axios.get('http://localhost:3000/simulacoes')
      setSim(response.data);

    };
    apiIndices();
    apiSim();
    //tentar chamar as funcoes apenas quando necessario
  }, []);

  const cdi = indicators[0];
  const ipca = indicators[1];

  function applyPercentage(num){
    let percentage;
    percentage = num.toLocaleString('pt-br');
    percentage = percentage + '%'; 
    return percentage;

  }

  function handleDeposit(){
    console.log('handleDeposit called!');
  }

  function cleanFields(){
    console.log('cleanFields called!');
  }

  function handleProfit(){
    console.log('handleProfit called!');
  }

  function handleResults(){
    console.log('handleResults called!')
    console.log(revenue, index, deadline, fstContribution, mthContribution);
  }

  function showResults(){
    console.log('Show results called!');
    
    if(result === true){
      return(
        <div>Resultados da consulta...</div>
      )
    }else{
      return(null);
    }

  }

  
  return (
    <div className="App">
      <h1>Simulador de Investimentos</h1> 
      <div className='container1'>
        <h3>Simulador</h3>
        <div className='yield'>
          <h6>Rendimento</h6>
          <div className='opt'>
            <input type="radio" id="gross" name="revenue" value="gross" onClick={()=> setRevenue('gross')}/>
            <label htmlFor="gross">Bruto</label>
            <input type="radio" id="net" name="revenue" value="net" onClick={()=> setRevenue('net')}/>
            <label htmlFor="net">Líquido</label>
        
          </div>

          <div className='input'>
            <label>Aporte Inicial</label>
            <input type='text'></input>
          </div>
          
          <div className='input'>
            <label>Prazo (em meses)</label>
            <input type='text'></input>
          </div>
          
          <div className='input'>
            <label>{ipca.nome}</label>
            <label>{applyPercentage(ipca.valor)}</label>
            
          </div>
          
          <div className='btn'>
            <button type="button" onClick={cleanFields}>Limpar campos</button>
          </div>
        
        </div>
        <div className='container2'>
          
          <h6>Tipos de indexação</h6>
          <div className='opt'>
            <input type="radio" id="pre" name="index" value="pre" onClick={()=> setIndex('pre')}/>
            <label htmlFor="pre">PRÉ</label>
            <input type="radio" id="post" name="index" value="post" onClick={()=> setIndex('post')}/>
            <label htmlFor="post">PÓS</label>
            <input type="radio" id="fixed" name="index" value="fixed" onClick={()=> setIndex('fixed')}/>
            <label htmlFor="fixed">FIXADO</label>
          </div>

          <div className='input'>
            <label>Aporte Mensal</label>
            <input type='text' onChange={handleDeposit}></input>
          </div>
          
          <div className='input'>
            <label>Rentabilidade</label>
            <input type='text' onChange={handleProfit}></input>
          </div>
          
          <div className='input'>
            <label>{cdi.nome} (ao ano)</label>
            <label>{applyPercentage(cdi.valor)}</label>
            
          </div>
          
          <div className='btn'>
            <button type="button" onClick={handleResults}>Simular</button>
          </div>

        </div>  
      </div>
      <div className='results'>
        {showResults()}
      </div>     
    </div>
  );
}

export default App;
