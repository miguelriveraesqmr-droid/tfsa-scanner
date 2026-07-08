import { useState, useEffect, useCallback } from "react";

const PORTFOLIO = [
  { ticker: "VFV", name: "Vanguard S&P 500", currency: "CAD", value: 3549 },
  { ticker: "TEC", name: "TD Tech ETF", currency: "CAD", value: 1246 },
  { ticker: "SHOP", name: "Shopify", currency: "CAD", value: 211 },
  { ticker: "BTCC", name: "Bitcoin ETF", currency: "CAD", value: 351 },
  { ticker: "XNDU", name: "Xanadu Quantum", currency: "CAD", value: 211 },
  { ticker: "MU", name: "Micron CDR", currency: "CAD", value: 287 },
];

const CAD_OPPORTUNITIES = [
  {
    ticker: "CIAI.TO",
    name: "CI Global AI ETF",
    sector: "AI",
    signal: "BUY",
    strength: 92,
    actionSummary: "✅ Compra ahora: en lugar de apostar todo a una sola empresa de AI, este ETF reparte tu dinero entre las mejores 50+ empresas del sector automáticamente. Subió 63% este año y sigue subiendo. Es como comprar una canasta de las mejores acciones de inteligencia artificial en un solo clic, en pesos canadienses.",
    reason: "Momentum AI sostenido, máximo 52 sem, +63% YTD",
    shortInterest: "2.1%",
    insiderBuying: false,
    risk: "MEDIO",
    catalyst: "Rally AI general",
    entry: "$39.50",
    target: "$46.00",
    stop: "$37.00",
    upside: "+16%",
  },
  {
    ticker: "SPCX.TO",
    name: "SpaceX CDR (CAD)",
    sector: "Aerospace/AI",
    signal: "WATCH",
    strength: 71,
    actionSummary: "👀 Vigilar pero no comprar todavía: SpaceX acaba de entrar a los índices principales esta semana, lo que obliga a grandes fondos a comprarla automáticamente — eso empuja el precio. Pero todavía está bajando desde cuando salió a bolsa. Espera a que se estabilice antes de entrar, o podrías comprar en el punto más alto y luego ver cómo baja.",
    reason: "Entrada al Nasdaq-100 esta semana, compra institucional forzada",
    shortInterest: "8.3%",
    insiderBuying: false,
    risk: "ALTO",
    catalyst: "Inclusión Nasdaq-100 julio 7",
    entry: "Esperar pullback $175-180",
    target: "+10% desde entrada",
    stop: "-5%",
    upside: "+10%",
  },
  {
    ticker: "AVGO.NE",
    name: "Broadcom CDR",
    sector: "Semiconductores",
    signal: "BUY",
    strength: 85,
    actionSummary: "✅ Compra con confianza: Broadcom fabrica los chips que conectan los servidores de AI de Google, Meta y Apple. Lo más importante: los propios directivos de la empresa están comprando acciones con su dinero personal — eso es la señal más honesta de que creen que va a subir.",
    reason: "Revenue AI +143% YoY, líder en chips de red para data centers",
    shortInterest: "1.8%",
    insiderBuying: true,
    risk: "MEDIO",
    catalyst: "Expansión AI infraestructura Q3",
    entry: "Precio actual",
    target: "+20%",
    stop: "-5%",
    upside: "+20%",
  },
  {
    ticker: "MSFT.NE",
    name: "Microsoft CDR",
    sector: "AI/Cloud",
    signal: "BUY",
    strength: 88,
    actionSummary: "✅ Compra para quedarte mucho tiempo: Microsoft es la empresa más segura del sector AI. Su servicio de nube (Azure) está creciendo rápido, y ya tienen AI integrada en Word, Excel, Teams y GitHub. No es emocionante como SpaceX, pero es la que tiene menos probabilidad de darte sustos.",
    reason: "Azure AI creciendo 35% YoY, Copilot integrado en todo el ecosistema",
    shortInterest: "0.9%",
    insiderBuying: false,
    risk: "BAJO",
    catalyst: "Earnings Q4 julio 2026",
    entry: "Precio actual",
    target: "+15%",
    stop: "-4%",
    upside: "+15%",
  },
  {
    ticker: "XNDU.TO",
    name: "Xanadu Quantum",
    sector: "Quantum",
    signal: "HOLD",
    strength: 38,
    actionSummary: "⏳ Aguanta hasta el 7 de agosto: ya tienes pérdida del 29% — vender ahora solo confirma la pérdida sin razón. En 30 días la empresa publica sus resultados y eso puede cambiar el precio drásticamente. Además, un fondo de inversión muy grande acaba de comprar una porción importante de la empresa — señal de que alguien con más información que nosotros cree que vale más.",
    reason: "Reporte agosto 7, Millennium tomó 5%+ stake, $390M gov. canadiense pendiente",
    shortInterest: "10.9%",
    insiderBuying: true,
    risk: "MUY ALTO",
    catalyst: "Earnings agosto 7",
    entry: "Ya en portafolio",
    target: "Decisión en agosto",
    stop: "$13 CAD",
    upside: "+229% (target analistas)",
  },
];

const USD_OPPORTUNITIES = [
  {
    ticker: "NVDA",
    name: "NVIDIA",
    sector: "AI/Semiconductores",
    signal: "BUY",
    strength: 94,
    actionSummary: "✅ Compra si baja a $125-130: NVIDIA fabrica las tarjetas gráficas que necesita toda la inteligencia artificial del mundo — básicamente no hay alternativa real. Bajó recientemente por nerviosismo general del mercado, no porque algo esté mal en la empresa. Esa caída es tu oportunidad de entrar más barato.",
    reason: "Dominancia absoluta en GPUs AI, backlog masivo de data centers",
    shortInterest: "1.2%",
    insiderBuying: false,
    risk: "MEDIO",
    catalyst: "Expansión HBM4, Vera Rubin",
    entry: "$125-130 USD",
    target: "$175 USD",
    stop: "$118 USD",
    upside: "+35%",
  },
  {
    ticker: "PLTR",
    name: "Palantir",
    sector: "AI Software",
    signal: "WATCH",
    strength: 78,
    actionSummary: "👀 Espera antes de comprar: Palantir ayuda a gobiernos y empresas a analizar datos con AI — tiene contratos que ninguna otra empresa puede ganar. El problema es que su precio bajó bastante y todavía no da señales claras de que ya tocó fondo. Espera a que llegue a $125 y se estabilice ahí un par de días antes de entrar.",
    reason: "Revenue Q1 +85% YoY, contratos gobierno en expansión",
    shortInterest: "3.4%",
    insiderBuying: false,
    risk: "MEDIO-ALTO",
    catalyst: "Expansión contratos AI gobierno",
    entry: "$125-127 USD",
    target: "$190 USD",
    stop: "$118 USD",
    upside: "+47%",
  },
  {
    ticker: "CRCL",
    name: "Circle (USDC)",
    sector: "Dólar Digital/Fintech",
    signal: "WATCH",
    strength: 62,
    actionSummary: "⚠️ Solo si aceptas el riesgo: Circle es la empresa que mantiene el dólar digital (USDC) — básicamente el puente entre el dinero tradicional y el mundo cripto/AI. Bajó 72% desde su precio más alto. Puede triplicar si las leyes de cripto avanzan en el Senado, pero también puede seguir bajando. Máximo $50-100 CAD, nunca más.",
    reason: "Intersección AI + stablecoin, adopción institucional creciente",
    shortInterest: "5.1%",
    insiderBuying: false,
    risk: "ALTO",
    catalyst: "Ley Clarity Act en Senado",
    entry: "$70-73 USD",
    target: "$143 USD",
    stop: "$65 USD",
    upside: "+96%",
  },
  {
    ticker: "MU",
    name: "Micron Technology",
    sector: "Semiconductores/Memoria",
    signal: "SELL",
    strength: 35,
    actionSummary: "🔴 Vende esta semana: la compraste para una jugada rápida de 3 días y ya llevas más de 2 semanas. El plan original se venció. Estás cerca de recuperar lo que pusiste — esa es tu ventana para salir sin perder dinero y usar ese capital en algo mejor. Si esperas más, el próximo reporte de resultados no llega hasta septiembre.",
    reason: "Trade original vencido, -20% última semana, próximo reporte sep 29",
    shortInterest: "2.8%",
    insiderBuying: false,
    risk: "ALTO",
    catalyst: "Próximo reporte sep 29",
    entry: "N/A - salir ahora",
    target: "N/A",
    stop: "Vender esta semana",
    upside: "N/A",
  },
];

const SIGNAL_CONFIG = {
  BUY: { color: "#00ff9d", bg: "rgba(0,255,157,0.12)", label: "✅ COMPRAR" },
  SELL: { color: "#ff4757", bg: "rgba(255,71,87,0.12)", label: "🔴 VENDER" },
  HOLD: { color: "#ffa502", bg: "rgba(255,165,2,0.12)", label: "⏳ ESPERAR" },
  WATCH: { color: "#1e90ff", bg: "rgba(30,144,255,0.12)", label: "👀 VIGILAR" },
};

const RISK_COLOR = {
  "BAJO": "#00ff9d",
  "MEDIO": "#ffa502",
  "MEDIO-ALTO": "#ff6b35",
  "ALTO": "#ff4757",
  "MUY ALTO": "#ff2d55",
};

const RISK_LABEL = {
  "BAJO": "🟢 Riesgo bajo — poco probable que baje mucho",
  "MEDIO": "🟡 Riesgo moderado — puede subir o bajar",
  "MEDIO-ALTO": "🟠 Riesgo considerable — puede moverse bastante",
  "ALTO": "🔴 Riesgo alto — puede bajar fuerte sin aviso",
  "MUY ALTO": "⛔ Riesgo muy alto — solo dinero que puedas perder",
};

function StrengthBar({ value }) {
  const color = value >= 80 ? "#00ff9d" : value >= 60 ? "#ffa502" : "#ff4757";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        flex: 1, height: 4, background: "rgba(255,255,255,0.08)",
        borderRadius: 2, overflow: "hidden"
      }}>
        <div style={{
          width: `${value}%`, height: "100%",
          background: color, borderRadius: 2,
          transition: "width 1s ease"
        }} />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 700, minWidth: 28 }}>{value}</span>
    </div>
  );
}

function OpportunityCard({ item, expanded, onToggle }) {
  const sig = SIGNAL_CONFIG[item.signal];
  return (
    <div onClick={onToggle} style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${sig.color}22`,
      borderLeft: `3px solid ${sig.color}`,
      borderRadius: 10,
      padding: "14px 16px",
      cursor: "pointer",
      transition: "all 0.2s",
      marginBottom: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: 0.5 }}>
              {item.ticker}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px",
              borderRadius: 20, background: sig.bg, color: sig.color,
              letterSpacing: 0.8
            }}>{sig.label}</span>
            {item.insiderBuying && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "2px 6px",
                borderRadius: 20, background: "rgba(255,215,0,0.12)",
                color: "#ffd700", letterSpacing: 0.5
              }}>INSIDER ↑</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
            {item.name} · {item.sector}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#00ff9d" }}>{item.upside}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
            Short: {item.shortInterest}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <StrengthBar value={item.strength} />
      </div>

      {expanded && (
        <div style={{
          marginTop: 14, paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.06)"
        }}>
          {/* Action Summary - prominent */}
          <div style={{
            background: `${sig.color}0d`,
            border: `1px solid ${sig.color}22`,
            borderRadius: 8, padding: "12px 14px", marginBottom: 14
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 1.2,
              color: sig.color, marginBottom: 6, textTransform: "uppercase"
            }}>
              ¿Por qué {sig.label}?
            </div>
            <p style={{
              fontSize: 12, color: "rgba(255,255,255,0.75)",
              margin: 0, lineHeight: 1.6
            }}>
              {item.actionSummary}
            </p>
          </div>

          {/* Levels grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 8, fontSize: 11
          }}>
            {[
              ["💰 Precio de entrada", item.entry],
              ["🎯 Precio objetivo", item.target],
              ["🛑 Salir si baja a", item.stop],
              ["⚡ Qué lo puede mover", item.catalyst],
            ].map(([label, val]) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 6, padding: "8px 10px"
              }}>
                <div style={{ color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{label}</div>
                <div style={{ color: "#fff", fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 8, padding: "8px 10px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 6, fontSize: 11,
            color: RISK_COLOR[item.risk]
          }}>
            {RISK_LABEL[item.risk]}
          </div>
        </div>
      )}
    </div>
  );
}

function PortfolioRow({ item }) {
  const pct = ((item.value - (item.value / (1 + (Math.random() * 0.4 - 0.2)))) / item.value * 100).toFixed(1);
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div>
        <span style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>{item.ticker}</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginLeft: 8 }}>
          {item.name}
        </span>
      </div>
      <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
        ${item.value.toLocaleString()} CAD
      </span>
    </div>
  );
}

export default function StockScanner() {
  const [tab, setTab] = useState("scanner");
  const [currency, setCurrency] = useState("CAD");
  const [expandedCard, setExpandedCard] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const opportunities = currency === "CAD" ? CAD_OPPORTUNITIES : USD_OPPORTUNITIES;
  const topBuys = opportunities.filter(o => o.signal === "BUY").sort((a, b) => b.strength - a.strength);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 800);
  };

  const getAIAnalysis = async () => {
    setLoadingAI(true);
    setAiAnalysis("");
    const topOpps = opportunities.slice(0, 3).map(o =>
      `${o.ticker} (${o.signal}): ${o.reason}. Upside: ${o.upside}. Riesgo: ${o.risk}.`
    ).join("\n");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `Eres un analista de inversiones experto para un inversor canadiense con TFSA en Wealthsimple. 
          Horario limitado: trabaja lunes a jueves 8am-5pm sin acceso al celular. 
          Estrategia: mix de hold largo plazo (VFV, TEC, SHOP) y trading rápido con stop-loss definido.
          Sé directo, conciso, en español. Sin rodeos ni frases de relleno.
          Responde con: 1) Oportunidad más fuerte del día 2) Acción concreta recomendada 3) Niveles exactos entrada/stop/target.`,
          messages: [{
            role: "user",
            content: `Analiza estas oportunidades para hoy en divisa ${currency}:\n${topOpps}\n\nPortafolio actual: VFV $3,549 (+0.54%), TEC $1,246 (-0.26%), SHOP $211 (+5.67%), BTCC $351 (-22%), MU $287 (-4%), XNDU $211 (-29%). Dame tu análisis del día en máximo 150 palabras.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "No se pudo generar el análisis.";
      setAiAnalysis(text);
    } catch (e) {
      setAiAnalysis("Error al conectar con el análisis. Intenta de nuevo.");
    }
    setLoadingAI(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'SF Pro Display', -apple-system, sans-serif",
      color: "#fff",
      maxWidth: 480,
      margin: "0 auto",
      padding: "0 0 80px",
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0,
        background: "#0a0a0f", zIndex: 10
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Scanner · TFSA
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>
              Oportunidades
            </div>
          </div>
          <button onClick={refresh} style={{
            background: "rgba(255,255,255,0.06)",
            border: "none", color: "rgba(255,255,255,0.6)",
            borderRadius: 20, padding: "6px 14px",
            fontSize: 12, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}>
            {loading ? "..." : "↻ Refrescar"}
          </button>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>
          Actualizado: {lastUpdated.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "12px 20px", gap: 8 }}>
        {["scanner", "portafolio"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
            color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
            textTransform: "capitalize"
          }}>
            {t === "scanner" ? "🔍 Scanner" : "📊 Portafolio"}
          </button>
        ))}
      </div>

      {tab === "scanner" && (
        <div style={{ padding: "0 20px" }}>
          {/* Currency Toggle */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.04)",
            borderRadius: 10, padding: 4, marginBottom: 16
          }}>
            {["CAD", "USD"].map(c => (
              <button key={c} onClick={() => { setCurrency(c); setExpandedCard(null); setAiAnalysis(""); }} style={{
                flex: 1, padding: "8px", borderRadius: 8,
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: currency === c ? (c === "CAD" ? "#c8102e" : "#003087") : "transparent",
                color: currency === c ? "#fff" : "rgba(255,255,255,0.35)",
                transition: "all 0.2s"
              }}>
                {c === "CAD" ? "🍁 CAD · TSX" : "🇺🇸 USD · Nasdaq"}
              </button>
            ))}
          </div>

          {/* Top Buy Highlight */}
          {topBuys[0] && (
            <div style={{
              background: "linear-gradient(135deg, rgba(0,255,157,0.08) 0%, rgba(0,255,157,0.03) 100%)",
              border: "1px solid rgba(0,255,157,0.2)",
              borderRadius: 12, padding: "14px 16px", marginBottom: 16
            }}>
              <div style={{ fontSize: 10, color: "#00ff9d", fontWeight: 700, letterSpacing: 1.2, marginBottom: 6 }}>
                ⚡ MEJOR OPORTUNIDAD DEL DÍA
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{topBuys[0].ticker}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{topBuys[0].name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#00ff9d" }}>{topBuys[0].upside}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>ganancia posible</div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>
                {topBuys[0].reason}
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                {[["Entrada", topBuys[0].entry], ["Stop", topBuys[0].stop], ["Target", topBuys[0].target]].map(([l, v]) => (
                  <div key={l} style={{
                    flex: 1, background: "rgba(0,0,0,0.3)", borderRadius: 8,
                    padding: "6px 8px", textAlign: "center"
                  }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis Button */}
          <button onClick={getAIAnalysis} disabled={loadingAI} style={{
            width: "100%", padding: "12px",
            background: loadingAI ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 10, color: loadingAI ? "rgba(255,255,255,0.3)" : "#818cf8",
            fontSize: 13, fontWeight: 600, cursor: loadingAI ? "default" : "pointer",
            marginBottom: 16, transition: "all 0.2s"
          }}>
            {loadingAI ? "Analizando..." : "🤖 Análisis AI del día"}
          </button>

          {aiAnalysis && (
            <div style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 10, padding: "14px 16px", marginBottom: 16
            }}>
              <div style={{ fontSize: 10, color: "#818cf8", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                ANÁLISIS AI · {currency}
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>
                {aiAnalysis}
              </p>
            </div>
          )}

          {/* Currency warning for USD */}
          {currency === "USD" && (
            <div style={{
              background: "rgba(255,165,2,0.08)",
              border: "1px solid rgba(255,165,2,0.2)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 14,
              fontSize: 11, color: "rgba(255,165,2,0.8)"
            }}>
              ⚠️ Posiciones en USD generan comisión de conversión (~1.5%) en Wealthsimple. Solo para oportunidades de alta convicción.
            </div>
          )}

          {/* Opportunities List */}
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10, letterSpacing: 0.8 }}>
            {opportunities.length} ACCIONES ANALIZADAS · {currency} · Toca cada una para ver el por qué
          </div>
          {opportunities.map((item, i) => (
            <OpportunityCard
              key={item.ticker}
              item={item}
              expanded={expandedCard === i}
              onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
            />
          ))}
        </div>
      )}

      {tab === "portafolio" && (
        <div style={{ padding: "0 20px" }}>
          {/* Total */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12, padding: "20px",
            marginBottom: 16, textAlign: "center"
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>VALOR TOTAL TFSA</div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>
              $5,855 <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>CAD</span>
            </div>
            <div style={{ fontSize: 13, color: "#ff4757", marginTop: 4 }}>-$212 aprox. desde compra</div>
          </div>

          {/* Holdings */}
          <div style={{ marginBottom: 20 }}>
            {PORTFOLIO.map(item => <PortfolioRow key={item.ticker} item={item} />)}
          </div>

          {/* Action Items */}
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 0.8, marginBottom: 10 }}>
            ACCIONES PENDIENTES
          </div>
          {[
            { label: "MU CDR", action: "Vender esta semana — trade original vencido", urgency: "URGENTE", color: "#ff4757" },
            { label: "XNDU", action: "Aguantar hasta reporte agosto 7", urgency: "VIGILAR", color: "#ffa502" },
            { label: "BTCC", action: "Mantener — esperar BTC > $60K", urgency: "MANTENER", color: "#1e90ff" },
            { label: "SHOP", action: "Mantener — mejor posición del portafolio", urgency: "OK", color: "#00ff9d" },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{item.label}</span>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{item.action}</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px",
                borderRadius: 20, background: `${item.color}18`, color: item.color
              }}>{item.urgency}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}