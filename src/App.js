
import { useState, useEffect } from 'react';
//funcoes basicas de Hooks para que funcionem a consulta ao API e estados, respectivamente

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
//funcoes para geracao de grafico

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckIcon from '@mui/icons-material/Check';

//funcoes para estilizacao da UI, de modo a serem compativeis com o projeto


import './App.css';
//estilos da aplicacao

import axios from 'axios';
//biblioteca que serve para realizar consultas a API de maneira mais eficiente

const api = axios.create({
  baseURL: 'http://localhost:3000'
});
//variavel que reserva o local base da API

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
//funcoes necessarias para o funcionamento do grafico

function App() {

 
 
  const [indicatorsName, setIndicatorsName] = useState([]);
  const [indicatorsValue, setIndicatorsValue] = useState([]); 
  const [sim, setSim] = useState(null);
  const [simIndex, setSimIndex] = useState(0);
  //Estados obtidos da API

  const [comAporteObj, setComAporteObj] = useState([]);
  const [semAporteObj, setSemAporteObj] = useState([]);
  const [comAporte, setComAporte] = useState([]);
  const [semAporte, setSemAporte] = useState([]);
  //Estados usados no grafico

  
  const [revenue, setRevenue] = useState('');
  const [index, setIndex] = useState('');
  const [deadline, setDeadline] = useState('');
  const [profitability, setProfitability] = useState('')
  const [fstContribution, setFstContribution] = useState('');
  const [mthContribution, setMthContribution] = useState('');
  //Estados para entradas do usuario

  const [mthContributionError, setmthContributionError] = useState(false);
  const [profitabilityError, setProfitabilityError] = useState(false)
  const [fstContributionError, setFstContributionError] = useState(false)
  const [deadlineError, setDeadlineError] = useState(false)
  const [result, setResult] = useState(false);
  const [isGross, setIsGross] = useState(false);
  const [isNet, setIsNet] = useState(false);
  const [isPre, setIsPre] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  //Estados para controle de dados e validacao

  useEffect(() => {
    async function getSimData() {
      //funcao que busca dados para simulacoes na API
      const response = await api.get('/simulacoes'); 
      setSim(response.data);
    }
    getSimData();  
  }, []);
  
  useEffect(() => {
    async function getChartData() {
      //funcao que busca dados para o grafico na API
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
      //funcao que busca os dados dos indicadores na API
      let indicatorsNames = [];
      let indicatorsValues = [];

      const response = await api.get('/indicadores');
      for (let indicator of response.data){
        indicatorsNames.push(indicator.nome);
        indicatorsValues.push(indicator.valor);
      }
      setIndicatorsName(indicatorsName => (indicatorsNames));
      setIndicatorsValue(indicatorsValue => (indicatorsValues));
      
    }
    getIndicators();
  }, []);

  function applyBrlConfig(num){
    //funcao responsavel por localizar os dados para o Real brasileiro

    let valueInReal;
    valueInReal = num.toLocaleString('pt-br', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
    
    return valueInReal;

  }

  function handleIndicator(){
    //funcao auxiliar para controle dos dados dos indicadores
    console.log(indicatorsName);
    console.log(indicatorsValue);
  }

  function handleSimIndex(){
    //funcao que define quais dados serao utilizados na simulacao, a depender da entrada do usuario
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
    //funcao responsavel por validar entradas do usuario
    e.preventDefault();
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
    //funcao responsavel por registrar os dados do primeiro aporte
    e.preventDefault(); 
    setFstContributionError(false);

    setFstContribution(e.target.value);
    
  }

  function handleMthCtb(e){
    //funcao responsavel por registrar os dados dos aportes mensais
    e.preventDefault();
    setmthContributionError(false)
    
    setMthContribution(e.target.value);
  }


  function cleanFields(){
    //funcao que limpa os campos (conforme sugere o nome)

    setFstContribution('');
    setFstContributionError(false);
    setMthContribution('');
    setmthContributionError(false);
    setDeadline('');
    setDeadlineError(false);
    setProfitability('');
    setProfitabilityError(false);
    setIsGross(false);
    setIsFixed(false);
    setIsNet(false);
    setIsPost(false);
    setIsPre(false);
    
  }

  function applyPercentage(num){
    //funcao responsavel por aplicar a porcentagem de acordo com o padrao brasileiro
    let percentage;
    percentage = num.toLocaleString('pt-br');
    percentage = percentage + '%'; 
    return percentage;

  }

  function handleRevenue(rev){
    //funcao responsavel por definir o tipo de rendimento
    setIsGross(false);
    setIsNet(false);
    
    if (rev === 'bruto'){
      setRevenue('bruto');
      setIsGross(true);
    }
    if (rev === 'liquido'){
      setRevenue('liquido');
      setIsNet(true);
    };
    

  }

  function handleIndex(ind){
    //funcao responsavel por definir o tipo de indexador
    setIsPre(false);
    setIsPost(false);
    setIsFixed(false);

    if (ind === 'pre'){
      setIndex('pre');
      setIsPre(true);
    }
    if (ind === 'pos'){
      setRevenue('pos');
      setIsPost(true);
    };
    if (ind === 'fixado'){
      setRevenue('fixado');
      setIsFixed(true);
    }
    
  }

  function handleChartData(){
    //funcao que ajusta os dados para o grafico, em funcao das entradas do usuario
    let i = simIndex;
    
    setComAporte(comAporte => (comAporteObj[i]));
    setSemAporte(semAporte => (semAporteObj[i]));

    return(comAporte, semAporte);
  }


  function handleResults(){
    //funcao de tratamento dos dados para o resultado
    let i = handleSimIndex();
    console.log(i);
    setSimIndex(i);
    handleIndicator();
    handleChartData();
    setResult(true);
  }


  function showResults(){
    //funcao que retorna os dados do resultado para o usuario
       
    const options = {
      //opcoes do grafico (conforme documentacao da biblioteca)
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
          backgroundColor: '#ED8E53',
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
    //condicao que verifica se o estado result esta ativo (sendo que este e ativado quando o usuario clica em simular e os dados foram validados)
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
                <p className="card-text">{applyBrlConfig(sim[i].valorFinalBruto)}</p>
              </div>
            </div>

            <div class="card">
              <div className="card-body">
                <h5 className="card-title">Aliquota do IR</h5>
                <p className="card-text">{applyPercentage(sim[i].aliquotaIR)}</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Valor Pago em IR</h5>
                <p className="card-text">{applyBrlConfig(sim[i].valorPagoIR)}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Valor final Líquido</h5>
                <p className="card-text">{applyBrlConfig(sim[i].valorFinalLiquido)}</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Valor Total Investido</h5>
                <p className="card-text">{applyBrlConfig(sim[i].valorTotalInvestido)}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Ganho Líquido</h5>
                <p className="card-text">{applyBrlConfig(sim[i].ganhoLiquido)}</p>
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
 
  //inicio da aplicacao
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
                

                <ButtonGroup variant="contained"  aria-label="tipo de rendimento">
                  <Button 
                    sx={
                      { backgroundColor: "#FEFEFE",
                        color: 'black',
                        borderColor: "#ED8E53",
                        '&:hover':{
                          backgroundColor: '#ED8E53',
                        },
                        '&:focus':{
                          backgroundColor: '#ED8E53',


                        },
                      }
                    } 
                    onClick={() => handleRevenue('bruto')}
                  >
                    {isGross ? <CheckIcon/> : ''} Bruto
                  </Button>
                  <Button 
                    sx={
                      { backgroundColor: "#FEFEFE",
                        color: 'black',
                        borderColor: "#ED8E53",
                        '&:hover':{
                          backgroundColor: '#ED8E53',
                        },
                        '&:focus':{
                          backgroundColor: '#ED8E53',


                        },
                      }
                    }  
                    onClick={() => handleRevenue('liquido')}
                  >
                    {isNet ? <CheckIcon/> : ''} Liquido
                  </Button>
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
                  helperText={fstContributionError ? "Aporte precisa ser número!" : ""}
                  
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
                  helperText={deadlineError ? "Prazo precisa ser número!" : ""}
                  
                />
              </div>
                
              <div className='input'>
                
                <TextField
                  required
                  id="outlined-read-only-input"
                  label="IPCA (ao ano)"
                  defaultValue= "10,06%"
                  variant="standard"
                  InputProps={{
                    readOnly: true,
                  }}
                  onClick={() => setIndex(indicatorsName[1])}
                />
              </div>
                
              <div className='btn'>
              <Button 
                  sx={
                      { backgroundColor: "#FEFEFE",
                        color: 'black',
                        borderColor: "#ED8E53",
                        '&:hover':{
                          backgroundColor: '#ED8E53',
                        },
                        '&:focus':{
                          backgroundColor: '#ED8E53',


                        },
                      }
                    } 
                  variant="outlined" 
                  onClick={cleanFields}
                >
                  Limpar Campos
                </Button>
              </div>
              
            </div>
            <div className='container2'>
            
              <h6 className='h6-title'>Tipos de indexação</h6>
              <div className='opt'>
                <ButtonGroup variant="contained" aria-label="tipos de indexadores" value={index}>
                    <Button 
                      sx={
                        { backgroundColor: "#FEFEFE",
                          color: 'black',
                          borderColor: "#ED8E53",
                          '&:hover':{
                            backgroundColor: '#ED8E53',
                          },
                          '&:focus':{
                            backgroundColor: '#ED8E53',
                          },
                        }
                      }  
                      onClick={()=> handleIndex('pre')}>
                        {isPre ? <CheckIcon/> : ''} PRÉ
                    </Button>
                    <Button 
                      sx={
                        { backgroundColor: "#FEFEFE",
                          color: 'black',
                          borderColor: "#ED8E53",
                          '&:hover':{
                            backgroundColor: '#ED8E53',
                          },
                          '&:focus':{
                            backgroundColor: '#ED8E53',


                          },
                        }
                      }  
                      onClick={()=> handleIndex('pos')}>
                        {isPost ? <CheckIcon/> : ''} PÓS
                    </Button>
                    <Button 
                      sx={
                        { backgroundColor: "#FEFEFE",
                          color: 'black',
                          borderColor: "#ED8E53",
                          '&:hover':{
                            backgroundColor: '#ED8E53',
                          },
                          '&:selected':{
                            backgroundColor: '#ED8E53',


                          },
                        }
                      }  
                      onClick={()=> handleIndex('fixado')}>
                        {isFixed ? <CheckIcon/> : ''} FIXADO
                    </Button>
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
                  helperText={mthContributionError ? "Aporte precisa ser número!" : ""}
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
                  helperText={profitabilityError ? "Rentabilidade precisa ser número!" : ""}
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
                  onClick={() => setIndex(indicatorsName[0])}
                />
                
              </div>
              
              <div className='btn'>
                <Button 
                  sx={
                      { backgroundColor: "#ED8E53",
                        color: 'black',
                        borderColor: "#ED8E53",
                        '&:hover':{
                          backgroundColor: '#ED8E53',
                        },
                        '&:selected':{
                          backgroundColor: '#ED8E53',


                        },
                      }
                    } 
                  variant="contained" 
                  type='submit'
                >
                  Simular
                </Button>
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

//Alguns adendos: foi percebido que nem todas as opcoes geram dados validos para uma simulacao. 
//Optou-se por manter um resultado padrao (na API os dados de simulacao correspondentes a 0)
//Futuramente seria interessante incluir tratamento para estes erros
//Foi utilizada a biblioteca Material-UI para adequar a UI ao que estava no projeto. A integracao
//mais adequada nao foi conseguida a tempo, sendo este outro ponto a resolver para futuras insercoes  