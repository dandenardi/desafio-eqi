import { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';


import './App.css';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3000'
});


function App() {

  //estados da API
  const [apiData, setApiData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [apiWait, setApiWait] = useState(false);
  const [indicators, setIndicators] = useState(null);
  const [sim, setSim] = useState(null);
  const [simIndex, setSimIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [criteria, setCriteria] = useState('');
  const [simBoxValues, setSimBoxValues] = useState({});
  
  const [comAporteObj, setComAporteObj] = useState([]);
  const [semAporteObj, setSemAporteObj] = useState([]);
  const [comAporte, setComAporte] = useState([]);
  const [semAporte, setSemAporte] = useState([]);

  const [result, setResult] = useState(false);
  const [revenue, setRevenue] = useState('bruto');
  const [index, setIndex] = useState('pre');
  const [deadline, setDeadline] = useState(0);
  const [profitability, setProfitability] = useState(0)
  const [fstContribution, setFstContribution] = useState(0);
  const [mthContribution, setMthContribution] = useState(0);
  const [selectData, setSelectData] = useState(0);


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
  

  function applyPercentage(num){
    let percentage;
    percentage = num.toLocaleString('pt-br');
    percentage = percentage + '%'; 
    return percentage;

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
      simIndex = null;
    }
    
    return simIndex;


  }


  function handleFstCtb(e){
    e.preventDefault();
    console.log(e.target);
    e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    
    setFstContribution(e.target.value);
    console.log(fstContribution);
  }

  function handleMthCtb(e){
    e.preventDefault();
    

    e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    
    setMthContribution(e.target.value);
    console.log(mthContribution);
  }

  function handleDeadline(e){
    e.preventDefault();
    
    setDeadline(e.target.value);
    console.log(deadline);
  }

  function cleanFields(){
    console.log('cleanFields called!');
  }

  function handleProfit(){
    console.log('handleProfit called!');
  }

  function handleChartData(){
    
    let i = simIndex;
    
    let comAporteStr = Object.keys(comAporteObj[i]).map(function (key) {
          
      // Using Number() to convert key to number type
      // Using obj[key] to retrieve key value
      return [Number(key), comAporteObj[i][key]];

    });

    let semAporteStr = Object.keys(comAporteObj[i]).map(function (key) {
          
      // Using Number() to convert key to number type
      // Using obj[key] to retrieve key value
      return [Number(key), comAporteObj[i][key]];

    });
    comAporteStr.unshift(['mes','valor']);
    semAporteStr.unshift(['mes','valor']);
    console.log(semAporteStr);
    setComAporte(comAporte => (comAporteStr));
    setSemAporte(semAporte => (semAporteStr));

    return(comAporte, semAporte);
  }

  function handleResults(){

    let i = handleSimIndex();
    console.log('handleResults called!')
    setSimIndex(i);
    handleChartData();
    setResult(true);
  }


  function showResults(){
    

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
          <div className='containers'>
            
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
                  id="standard-basic" 
                  label="Aporte inicial" 
                  variant="standard" 
                  onChange={handleFstCtb}/>
              </div>
                
              <div className='input'>
                <TextField 
                  id="standard-basic" 
                  label="Prazo (em meses)" 
                  variant="standard" 
                  onChange={(e)=>{setDeadline(e.target.value)}}
                />
              </div>
                
              <div className='input'>
                
                <TextField
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
                 <ButtonGroup variant="contained" aria-label="tipos de indexadores">
                    <Button  onClick={()=> setIndex('pre')}>PRÉ</Button>
                    <Button  onClick={()=> setIndex('pos')}>PÓS</Button>
                    <Button  onClick={()=> setIndex('fixado')}>FIXADO</Button>
                  </ButtonGroup>
              </div>

              <div className='input'>
                <TextField 
                  id="standard-basic" 
                  label="Aporte Mensal" 
                  variant="standard" 
                  onChange={handleMthCtb}
                />

              </div>
              
              <div className='input'>
                <TextField 
                  id="standard-basic" 
                  label="Rentabilidade" 
                  variant="standard" 
                  onChange={(e)=>{setProfitability(e.target.value)}}
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
                <Button variant="contained" onClick={handleResults}>Simular</Button>
              </div>

            </div>
            
          </div>
        </div>
        
        <div className='results'>
          {showResults()}
        </div>     
      </div>
  </div>
      
  );
}

export default App;
