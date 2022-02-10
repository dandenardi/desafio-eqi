import { useState, useEffect, useCallback } from 'react';
import { Chart } from 'react-google-charts'
 
import './App.css';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3000'
});
//fazer os estados dos resultados (5), baseados em rendimento e indexacao (restante eh fixo)

function App() {

  //estados da API
  const [apiData, setApiData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [indicators, setIndicators] = useState(null);
  const [sim, setSim] = useState(null);
  const [simIndex, setSimIndex] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [criteria, setCriteria] = useState('');
  const [simBoxValues, setSimBoxValues] = useState({});
  

  const [simChartValues, setSimChartValues] = useState();

  const [result, setResult] = useState(false);
  const [revenue, setRevenue] = useState('bruto');
  const [index, setIndex] = useState('pre');
  const [deadline, setDeadline] = useState(0);
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

  function handleResults(){

    let i = handleSimIndex();
    console.log('handleResults called!')
    setSimIndex(i);
    setResult(true);
  }

  function showResults(){
    
    let i = simIndex;

    /* let arrObj = 'sim[0].graficoValores.comAporte';

    var comAporte = arrObj.map(function(obj) {
      return Object.keys(obj).map(function(key) {
          return obj[key];
      });
  }); */
    const options = {
      title: 'Projeção de Valores',
      hAxis: { title: "tempo(meses)", viewWindow: { min: 0, max: 11 } },
      vAxis: { title: "Valor (R$)", viewWindow: { min: 0, max: 2100 } },
      legend: {position: 'bottom'},
      
    };

    const comAporte = [
      ["tempo (meses)", "Valor (R$)"],
      ["0", 1000],
      ["1", 1103.2737397822002],
      ["2", 1206.8855709147763],
      ["3", 1310.8366002208454],
      ["4", 1415.1279381469494],
      ["5", 1519.7606987749612],
      ["6", 1624.7359998339643],
      ["7", 1730.0549627121918],
      ["8", 1835.7187124690122],
      ["9", 1941.7283778469462],
      ["10", 2048.0850912837323]
    ];

    const semAporte = [
      ["tempo (meses)", "Valor (R$)"],
      ["0", 1000],
      ["1", 1003.273739782199],
      ["2", 1006.5581969365594],
      ["3", 1009.853406548969],
      ["4", 1013.1594038201774],
      ["5", 1016.4762240661724],
      ["6", 1019.8039027185573],
      ["7", 1023.1424753249288],
      ["8", 1026.4919775492574],
      ["9", 1029.8524451722683],
      ["10", 1033.2239140918239]
    ];
    
    let diffdata = {
      old: comAporte,
      new: semAporte,
    };


    if(result === true){
      return(
        
        <div className='results'>
          <div>
            <h2>Resultado da Simulação</h2>
          </div>

          <div className='data-boxes'>
            <div className='box'>
              <h3>Valor final Bruto</h3>
              <p>{sim[i].valorFinalBruto}</p>
            </div>
                      
            <div className='box'>
              <h3>Aliquota do IR</h3>
              <p>{sim[i].aliquotaIR}</p>
            </div>
            
            <div className='box'>
                <h3>Valor Pago em IR</h3>
              <p>{sim[i].valorPagoIR}</p>
            </div>
            
            <div className='box'>
              <h3>Valor final Líquido</h3>
              <p>{sim[i].valorFinalLiquido}</p>
            </div>  
          
            <div className='box'>
              <h3>Valor Total Investido</h3>
              <p>{sim[i].valorTotalInvestido}</p>
            </div>

            <div className='box'>
              <h3>Ganho Líquido</h3>
              <p>{sim[i].ganhoLiquido}</p>
            </div>
          </div>

          <div className='chart'>
              <h3>Projeção de Valores</h3>
               
              <Chart 
                chartType="ColumnChart"
                options={options}
                
                width="100%"
                height='400px'
                diffdata={diffdata}
                legendToggle
              
              />
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
      <div className='container1'>
        <h3>Simulador</h3>
        <div className='yield'>
          <h6>Rendimento</h6>
          <div className='opt'>
            <input type="radio" id="bruto" name="revenue" value="bruto" onClick={()=> setRevenue('bruto')}/>
            <label htmlFor="bruto">Bruto</label>
            <input type="radio" id="liquido" name="revenue" value="liquido" onClick={()=> setRevenue('liquido')}/>
            <label htmlFor="liquido">Líquido</label>
        
          </div>

          <div className='input'>
            <label className='error-fst-ctb' id='fst-ctb-label'>Aporte Inicial</label>
            <input type='text' onChange={handleFstCtb}></input>
            <div className='error-fst-ctb'></div>
          </div>
          
          <div className='input'>
            <label>Prazo (em meses)</label>
            <input type='text' pattern="[0-9]+" onChange={handleDeadline}></input>
          </div>
          
          <div className='input'>
            <label>IPCA (ao ano)</label>
            <input type="radio" id="IPCA" name="index" value="10,06%" onClick={()=> setIndex(indicators[1].nome)}/>
            <label htmlFor="ipca">10,06%</label>
            
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
            <input type="radio" id="post" name="index" value="post" onClick={()=> setIndex('pos')}/>
            <label htmlFor="post">PÓS</label>
            <input type="radio" id="fixed" name="index" value="fixed" onClick={()=> setIndex('fixado')}/>
            <label htmlFor="fixed">FIXADO</label>
          </div>

          <div className='input'>
            <label id='mth-ctb'>Aporte Mensal</label>
            <input type='text' pattern="[0-9]+" onChange={handleMthCtb}></input>
          </div>
          
          <div className='input'>
            <label>Rentabilidade</label>
            <input type='text' pattern="[0-9]+" onChange={handleProfit}></input>
          </div>
          
          <div className='input'>
            <label>CDI (ao ano)</label>
            <input type="radio" id="CDI" name="index" value="9,15%" onClick={()=> setIndex(indicators[0].nome)}/>
            <label htmlFor="cdi">9,15%</label>
            
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
