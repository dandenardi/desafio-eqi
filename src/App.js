import { useState, useEffect, useCallback } from 'react';
import { Chart } from 'react-google-charts'
 
import './App.css';
import axios from 'axios';


//fazer os estados dos resultados (5), baseados em rendimento e indexacao (restante eh fixo)

function App() {

  //estados da API
  const [apiData, setApiData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [indicators, setIndicators] = useState([]);
  const [sim, setSim] = useState({});
  const [simIndex, setSimIndex] = useState(0);
  const [simOpt, setSimOpt] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [criteria, setCriteria] = useState('');
  const [simBoxValues, setSimBoxValues] = useState({});
  

  const [simChartValues, setSimChartValues] = useState({
    withContribution: [{}],
    withoutContribution: [{}]
  })

  const [result, setResult] = useState(false);
  const [revenue, setRevenue] = useState('bruto');
  const [index, setIndex] = useState('pre');
  const [deadline, setDeadline] = useState(0);
  const [fstContribution, setFstContribution] = useState(0);
  const [mthContribution, setMthContribution] = useState(0);
  const [selectData, setSelectData] = useState(0);


  const fetchDataInd = useCallback (() => {
    axios
      .get('http://localhost:3000/indicadores')
      .then(resp => {
        setIndicators(resp.data)
        setIsLoading(false)
      }

      )
      .catch(error  => {
        setError(error.message)
        setIsLoading(false)
      })
  }, []) 

  useEffect(() => {
    fetchDataInd()
  }, [fetchDataInd])
    
  const fetchDataSim = useCallback (() => {
    axios
      .get('http://localhost:3000/simulacoes')
      .then(resp => {
        setSim(resp.data)
        setIsLoading(false)
      }

      )
      .catch(error  => {
        setError(error.message)
        setIsLoading(false)
      })
  }, []) 

  useEffect(() => {
    fetchDataSim()
  }, [fetchDataSim])

 
  if (error){
    return <h1>Erro ao consultar a API: {error}</h1>
  }


  function applyPercentage(num){
    let percentage;
    percentage = num.toLocaleString('pt-br');
    percentage = percentage + '%'; 
    return percentage;

  }

  function handleSimIndex(){
    
    if (index === 'pre' && revenue === 'bruto'){
      setSimIndex(0);
    }else if (index === 'pos' && revenue === 'bruto'){
      setSimIndex(1);
    }else if (index === 'ipca' && revenue === 'bruto'){
      setSimIndex(2)
    }else if (index === 'pre' && revenue === 'liquido'){
      setSimIndex(3)
    }else if (index === 'pos' && revenue === 'liquido'){
      setSimIndex(4)
    }else if (index === 'ipca' && revenue === 'liquido'){
      setSimIndex(5)
    }else{
      console.log('Esta opção não retorna dados de simulação válidos!');
    }

  }

  function handleSimData(){
    
    console.log('HandleSimData called!');
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
    
    handleSimIndex();
    console.log(simIndex);
    handleSimData()

    console.log('handleResults called!')
    console.log(revenue, index, fstContribution, mthContribution);
    setResult(true);
  }
  
  function showResults(){
    
    let i = simIndex;
    console.log('sim[i].graficoValores.comAporte')
    const dataOld = [
       ['joago', 'fernando'],
       ['fiz', 1000],
       ["Rachel", 100],
      ["Patrick", 200],
      ["Eric", 1900],
    ];
    
    const dataNew = [
      ["Name", "Popularity"],
      ["Cesar", 370],
      ["Rachel", 600],
      ["Patrick", 700],
      ["Eric", 1500],
    ];
    
    let diffdata = {
      old: dataOld,
      new: dataNew,
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
            <label>CDI (ao ano)</label>
            <input type="radio" id="IPCA" name="index" value="10,06%" onClick={()=> setIndex(indicators[1].nome)}/>
            <label htmlFor="cdi">10,06%</label>
            
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
