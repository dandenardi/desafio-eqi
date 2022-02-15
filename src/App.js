import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { InputAdornment } from '@mui/material';

import './App.css';
import axios from 'axios';
import { findAllByTestId } from '@testing-library/react';



const api = axios.create({
  baseURL: 'http://localhost:3000'
});


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function App() {

  //estados da API
 
  const [indicators, setIndicators] = useState(null);
  const [sim, setSim] = useState(null);
  const [simIndex, setSimIndex] = useState(0);
  
  const [comAporteObj, setComAporteObj] = useState([]);
  const [semAporteObj, setSemAporteObj] = useState([]);
  const [comAporte, setComAporte] = useState([]);
  const [semAporte, setSemAporte] = useState([]);

  const [result, setResult] = useState(false);
  const [revenue, setRevenue] = useState('bruto');
  const [index, setIndex] = useState('pre');
  const [deadline, setDeadline] = useState('');
  const [deadlineError, setDeadlineError] = useState(false)
  const [profitability, setProfitability] = useState('')
  const [profitabilityError, setProfitabilityError] = useState(false)
  const [fstContribution, setFstContribution] = useState('');
  const [fstContributionError, setFstContributionError] = useState(false)
  const [mthContribution, setMthContribution] = useState('');
  const [mthContributionError, setmthContributionError] = useState(false)


  useEffect(() => {
    async function getSimData() {
      
      const response = await api.get('/simulacoes'); 
      setSim(response.data);
    }
    getSimData();  
  }, []);
  
  useEffect(() => {
    async function getChartData() {
      let comAporteRaw = [];
      let semAporteRaw = [];
      
      const response = await api.get('/simulacoes');
      for (let chartElement of response.data){
        
        comAporteRaw.push(chartElement.graficoValores.comAporte);
        semAporteRaw.push(chartElement.graficoValores.semAporte);
      }
       
      setComAporteObj(comAporteObj => (comAporteRaw));
      setSemAporteObj(semAporteObj => (semAporteRaw));
      
    }
    getChartData();  
  }, []);

  useEffect(() => {
    async function getIndicators() {
      const response = await api.get('/indicadores');
      setIndicators(response.data);
    }
    getIndicators();
  }, []);

  function applyRealConfig(num){
    let valueInReal;
    valueInReal = num.toLocaleString('pt-br', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
    
    return valueInReal;

  }

  function handleSimIndex(){
    
    let simIndex;

    if (index === 'pre' && revenue === 'bruto'){
      simIndex = 0;
    }else if (index === 'pos' && revenue === 'bruto'){
      simIndex = 1;
    }else if (index === 'ipca' && revenue === 'bruto'){
      simIndex = 2;
    }else if (index === 'pre' && revenue === 'liquido'){
      simIndex = 3;
    }else if (index === 'pos' && revenue === 'liquido'){
      simIndex = 4;
    }else if (index === 'ipca' && revenue === 'liquido'){
      simIndex = 5;
    }else{
      console.log('Esta opção não retorna dados de simulação válidos!');
      simIndex = 0;
    }
    
    return simIndex;


  }

  function handleSubmit(e){

    e.preventDefault();
    console.log('HandleSubmit chamado!');
    if(isNaN(fstContribution)){
      setFstContributionError(true);
      return false; 
    } 
    
    if(isNaN(mthContribution)){
      setmthContributionError(true);
      return false;
    } 

    if(isNaN(profitability)){
      setProfitabilityError(true);
      return false;
    }
    
    if(isNaN(deadline)){
      setDeadlineError(true);
      return false;
    }

    handleResults();
  }

  function handleFstCtb(e){
    e.preventDefault();
    setFstContributionError(false);
    setFstContribution(e.target.value);
    
  }

  function handleMthCtb(e){
    e.preventDefault();
    setmthContributionError(false)
    
    setMthContribution(e.target.value);
  }


  function cleanFields(){
   
    console.log('cleanFields called!');
    setFstContribution('');
    setFstContributionError(false);
    setMthContribution('');
    setmthContributionError(false);
    setDeadline('');
    setDeadlineError(false);
    setProfitability('');
    setProfitabilityError(false);
    
  }

  function handleProfit(){
    console.log('handleProfit called!');
  }

  function handleChartData(){
    
    let i = simIndex;
    
    setComAporte(comAporte => (comAporteObj[i]));
    setSemAporte(semAporte => (semAporteObj[i]));

    return(comAporte, semAporte);
  }


  function handleResults(){

    let i = handleSimIndex();
    console.log(i);
    setSimIndex(i);
    handleChartData();
    setResult(true);
  }


  function showResults(){
    
       
    const options = {
      
      plugins: {
        
        title: {
          display: true,
          text: 'Projeção de Valores',
          position: 'top',
        },
        legend: {
          position: 'bottom', 
        },
      },
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Tempo (meses)',
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Valor (R$)',
          },
        },
      },
    };
    
    const labels = [];
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Com Aporte',
          data: comAporte,
          backgroundColor: 'rgb(255, 102, 0)',
          stack: 'Stack 0',
        },
        {
          label: 'Sem Aporte',
          data: semAporte,
          backgroundColor: 'rgb(0, 0, 0)',
          stack: 'Stack 0',
        },
        
      ],
    };
    

    let i = simIndex; 

    if(result === true){
      return(
        
        <div className='results'>
          <div>
            <h2>Resultado da Simulação</h2>
          </div>

          <div className="card-boxes">

            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">Valor final Bruto</h5>
                <p className="card-text">{sim[i].valorFinalBruto}</p>
              </div>
            </div>

            <div class="card">
              <div className="card-body">
                <h5 className="card-title">Aliquota do IR</h5>
                <p className="card-text">{sim[i].aliquotaIR}</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Valor Pago em IR</h5>
                <p className="card-text">{sim[i].valorPagoIR}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Valor final Líquido</h5>
                <p className="card-text">{sim[i].valorFinalLiquido}</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Valor Total Investido</h5>
                <p className="card-text">{sim[i].valorTotalInvestido}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Ganho Líquido</h5>
                <p className="card-text">{sim[i].ganhoLiquido}</p>
              </div>
            </div>

          <div className='chart'>
            <Bar options={options} data={data} />
          </div>

        </div>
      </div>
      )
    }else{
      return(null);
    }
    
  }
 
  
  return (

    <div className="App">

      <h1>Simulador de Investimentos</h1> 
      <div className='simulator'>
        
        <div className='containers-holder'>
          <h3>Simulador</h3>
        
          <form className='form' onSubmit={(e) => handleSubmit(e)}>
            
            <div className='container1'>
                  
              <h6 className='h6-title'>Rendimento</h6>
              <div className='opt'>
                <ButtonGroup variant="contained" aria-label="tipo de rendimento">
                  <Button onClick={() => setRevenue('bruto')}>Bruto</Button>
                  <Button onClick={() => setRevenue('liquido')}>Líquido</Button>
                </ButtonGroup>
            
              </div>
    
              <div className='input'>
                <TextField 
                  required
                  id="standard-basic" 
                  label="Aporte inicial" 
                  variant="standard" 
                  value={fstContribution}
                  onChange={handleFstCtb}
                  error={fstContributionError}
                  helperText={fstContributionError ? "Precisa ser número!" : ""}
                  
                />
                
              </div>
                
              <div className='input'>
                <TextField 
                  required
                  id="standard-basic" 
                  label="Prazo (em meses)" 
                  variant="standard" 
                  value={deadline}
                  onChange={(e)=>{setDeadline(e.target.value)}}
                  error={deadlineError}
                  helperText={deadlineError ? "Precisa ser número!" : ""}
                />
              </div>
                
              <div className='input'>
                
                <TextField
                  required
                  id="outlined-read-only-input"
                  label="IPCA (ao ano)"
                  defaultValue="10,06%"
                  variant="standard"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
                
              <div className='btn'>
                <Button variant="outlined" onClick={cleanFields}>Limpar dados</Button>
              </div>
              
            </div>
            <div className='container2'>
            
              <h6 className='h6-title'>Tipos de indexação</h6>
              <div className='opt'>
                <ButtonGroup variant="contained" aria-label="tipos de indexadores" value={index}>
                    <Button  onClick={()=> setIndex('pre')}>PRÉ</Button>
                    <Button  onClick={()=> setIndex('pos')}>PÓS</Button>
                    <Button  onClick={()=> setIndex('fixado')}>FIXADO</Button>
                  </ButtonGroup>
              </div>

              <div className='input'>
                <TextField 
                  required
                  id="standard-basic" 
                  label="Aporte Mensal" 
                  variant="standard" 
                  value={mthContribution}
                  onChange={handleMthCtb}
                  error={mthContributionError}
                  helperText={mthContributionError ? "Precisa ser número!" : ""}
                />

              </div>
              
              <div className='input'>
                <TextField 
                  required
                  id="standard-basic" 
                  label="Rentabilidade" 
                  variant="standard" 
                  value={profitability}
                  onChange={(e)=>{setProfitability(e.target.value)}}
                  error={profitabilityError}
                  helperText={profitabilityError ? "Precisa ser número!" : ""}
                />
              </div>
              
              <div className='input'>
              <TextField
                  id="outlined-read-only-input"
                  label="CDI (ao ano)"
                  defaultValue="9,15%"
                  variant="standard"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                
              </div>
              
              <div className='btn'>
                <Button variant="contained" type='submit'>Simular</Button>
              </div>

            </div>
            
          </form>
        
          
        </div>
        
        <div className='results'>
          {showResults()}
        </div>     
      </div>
  </div>
      
  );
}

export default App;
