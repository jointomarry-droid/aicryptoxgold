import { useState } from 'react';
import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { Calculator, DollarSign, Percent, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

type CalcType = 'compound' | 'sip' | 'emi' | 'roi' | 'gold';

export function FinancialCalculatorsPage() {
  const [active, setActive] = useState<CalcType>('compound');
  return (
    <Layout>
      <SEO title="Financial Calculators" />
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl glow-gold"><Calculator className="text-primary" size={24} /></div>
            <div>
              <h1 className="text-2xl font-display font-bold text-on-background">Financial Calculators</h1>
              <p className="text-sm text-on-surface-variant">Plan your investments with precision</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {([['compound','Compound Interest'],['sip','SIP Calculator'],['emi','EMI Calculator'],['roi','ROI Calculator'],['gold','Gold Value']] as [CalcType,string][]).map(([k,l])=>(
            <button key={k} onClick={()=>setActive(k)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", active===k?"bg-primary text-black":"bg-surface-dim text-on-surface-variant hover:bg-surface-highlight")}>{l}</button>
          ))}
        </div>
        {active==='compound' && <CompoundCalc />}
        {active==='sip' && <SipCalc />}
        {active==='emi' && <EmiCalc />}
        {active==='roi' && <RoiCalc />}
        {active==='gold' && <GoldValCalc />}
      </div>
    </Layout>
  );
}

function CompoundCalc() {
  const [p,setP]=useState(10000);const [r,setR]=useState(8);const [t,setT]=useState(10);const [n,setN]=useState(12);
  const amount=p*Math.pow(1+r/(n*100),n*t);const ci=amount-p;
  return (<Card title="Compound Interest" icon={<TrendingUp size={18}/>}>
    <Row label="Principal" value={p} onChange={setP} prefix="$" />
    <Row label="Annual Rate (%)" value={r} onChange={setR} suffix="%" />
    <Row label="Years" value={t} onChange={setT} />
    <Row label="Compounds/Year" value={n} onChange={setN} />
    <Result label="Total Amount" value={formatCurrency(amount)} highlight />
    <Result label="Interest Earned" value={formatCurrency(ci)} />
  </Card>);
}

function SipCalc() {
  const [m,setM]=useState(5000);const [r,setR]=useState(12);const [t,setT]=useState(10);
  const mr=r/12/100;const months=t*12;
  const futureValue=m*((Math.pow(1+mr,months)-1)/mr)*(1+mr);
  const invested=m*months;
  return (<Card title="SIP Calculator" icon={<DollarSign size={18}/>}>
    <Row label="Monthly Investment" value={m} onChange={setM} prefix="$" />
    <Row label="Expected Return (% p.a.)" value={r} onChange={setR} suffix="%" />
    <Row label="Years" value={t} onChange={setT} />
    <Result label="Invested Amount" value={formatCurrency(invested)} />
    <Result label="Maturity Value" value={formatCurrency(futureValue)} highlight />
    <Result label="Wealth Gained" value={formatCurrency(futureValue-invested)} />
  </Card>);
}

function EmiCalc() {
  const [p,setP]=useState(5000000);const [r,setR]=useState(8.5);const [t,setT]=useState(20);
  const mr=r/12/100;const months=t*12;
  const emi=p*mr*Math.pow(1+mr,months)/(Math.pow(1+mr,months)-1);
  const total=emi*months;const interest=total-p;
  return (<Card title="EMI Calculator" icon={<Percent size={18}/>}>
    <Row label="Loan Amount" value={p} onChange={setP} prefix="$" />
    <Row label="Interest Rate (% p.a.)" value={r} onChange={setR} suffix="%" />
    <Row label="Tenure (Years)" value={t} onChange={setT} />
    <Result label="Monthly EMI" value={formatCurrency(emi)} highlight />
    <Result label="Total Payment" value={formatCurrency(total)} />
    <Result label="Total Interest" value={formatCurrency(interest)} />
  </Card>);
}

function RoiCalc() {
  const [inv,setInv]=useState(100000);const [ret,setRet]=useState(200000);const [t,setT]=useState(3);
  const roi=((ret-inv)/inv)*100;const annRoi=(Math.pow(ret/inv,1/t)-1)*100;
  return (<Card title="ROI Calculator" icon={<Clock size={18}/>}>
    <Row label="Investment" value={inv} onChange={setInv} prefix="$" />
    <Row label="Returns" value={ret} onChange={setRet} prefix="$" />
    <Row label="Period (Years)" value={t} onChange={setT} />
    <Result label="Total ROI" value={`${roi.toFixed(1)}%`} highlight />
    <Result label="Annualized ROI" value={`${annRoi.toFixed(1)}%`} />
    <Result label="Profit/Loss" value={formatCurrency(ret-inv)} />
  </Card>);
}

function GoldValCalc() {
  const [oz,setOz]=useState(1);const [price,setPrice]=useState(2350);
  const ozToG=31.1035;
  const val=oz*price;const grams=oz*ozToG;
  return (<Card title="Gold Value Calculator" icon={<DollarSign size={18}/>}>
    <Row label="Gold Price (USD/oz)" value={price} onChange={setPrice} prefix="$" />
    <Row label="Weight (Troy oz)" value={oz} onChange={setOz} />
    <Result label="Total Value" value={formatCurrency(val)} highlight />
    <Result label="Weight (grams)" value={`${grams.toFixed(2)} g`} />
    <Result label="Value per Gram" value={formatCurrency(val/grams)} />
  </Card>);
}

function Card({title,icon,children}:{title:string;icon:React.ReactNode;children:React.ReactNode}){
  return (<div className="glass-panel rounded-2xl p-6"><div className="flex items-center gap-2 mb-6"><span className="text-primary">{icon}</span><h3 className="text-xl font-display font-bold text-on-background">{title}</h3></div><div className="space-y-4">{children}</div></div>);
}

function Row({label,value,onChange,prefix,suffix}:{label:string;value:number;onChange:(v:number)=>void;prefix?:string;suffix?:string}){
  return (<div><label className="text-xs text-on-surface-variant mb-1 block">{label}</label><div className="flex items-center bg-surface-dim border border-outline rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
    {prefix&&<span className="px-3 text-on-surface-variant text-sm">{prefix}</span>}
    <input type="number" value={value} onChange={e=>onChange(parseFloat(e.target.value)||0)} className="flex-1 bg-transparent px-3 py-2.5 text-on-background font-mono text-sm outline-none w-full" />
    {suffix&&<span className="px-3 text-on-surface-variant text-sm">{suffix}</span>}
  </div></div>);
}

function Result({label,value,highlight}:{label:string;value:string;highlight?:boolean}){
  return (<div className="flex items-center justify-between bg-surface-dim rounded-xl px-4 py-3"><span className="text-sm text-on-surface-variant">{label}</span><span className={cn("font-mono font-bold",highlight?"text-primary text-lg":"text-on-background")}>{value}</span></div>);
}
