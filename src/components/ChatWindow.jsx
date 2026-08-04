import { useState, useEffect, useRef } from 'react';
import Disclaimer from './Disclaimer';

const KNOWLEDGE_BASE = [
  {
    topics: ['follicular phase', 'follicular'],
    text: "The follicular phase begins on the first day of your period and lasts until ovulation (typically Days 6–13). During this phase, Follicle-Stimulating Hormone (FSH) prompts the ovaries to prepare follicles, causing estrogen levels to rise steadily. Physically and mentally, this estrogen surge boosts energy, sharpens cognitive focus, and elevates mood, making it an ideal time for strength training and high productivity. For wellness support, focus on fresh, vibrant foods, light proteins, and fermented vegetables to aid estrogen metabolism.",
    source: "Clinical Gynecology Review"
  },
  {
    topics: ['ovulation', 'ovulating'],
    text: "Ovulation typically occurs around Day 14 of a 28-day cycle, triggered by a sharp surge in Luteinizing Hormone (LH). The mature egg is released from the ovary and survives for 12–24 hours. Estrogen peaks just before ovulation, which can enhance social confidence and libido. Wellness recommendation: Engage in cardiovascular exercises and support fertility or cycle tracking by monitoring basal body temperature and cervical mucus changes.",
    source: "Association of Reproductive Health Professionals"
  },
  {
    topics: ['luteal phase', 'luteal'],
    text: "The luteal phase spans Days 15–28, post-ovulation. Progesterone rises to prepare the uterine lining for potential pregnancy. If fertilization doesn't occur, hormone levels drop, which can cause Premenstrual Syndrome (PMS) symptoms like bloating, mood swings, and fatigue. During this phase, switch to lower-intensity movement like yoga, and consume complex carbohydrates and magnesium-rich foods to stabilize mood and energy.",
    source: "Endocrine Society Clinical Studies"
  },
  {
    topics: ['menstruation', 'period', 'menstrual', 'bleeding'],
    text: "Menstruation (Days 1–5) marks the shedding of the uterine lining due to a drop in progesterone and estrogen. Typical symptoms include cramping, fatigue, and mild lower back pain. Energy is naturally lower, so gentle stretching, walking, and adequate rest are advised. Focus on iron-rich foods, warm teas, and anti-inflammatory spices like ginger to ease cramping.",
    source: "World Health Organization Women's Health Guidelines"
  },
  {
    topics: ['iron deficiency', 'anemia', 'iron', 'fatigue'],
    text: "Iron deficiency and anemia occur when blood lacks sufficient red blood cells or hemoglobin, often caused by menstrual blood loss in women of childbearing age. Classic symptoms include extreme fatigue, weakness, pale skin, and cold extremities. Wellness approach: Pair iron-rich foods (such as spinach, legumes, and lean red meats) with Vitamin C to double absorption rates, and seek professional medical guidance before starting iron supplements.",
    source: "National Institutes of Health (NIH) Hematology Division"
  },
  {
    topics: ['irregular cycles', 'irregular period', 'irregular menstruation', 'irregularly'],
    text: "Irregular cycles (longer than 35 days, shorter than 21 days, or highly variable) can be triggered by thyroid dysfunction, elevated stress (cortisol), rapid weight changes, or PCOS. While occasional variance is normal due to temporary stressors, persistent irregularity should be evaluated by a healthcare professional. Cycle tracking helps identify baseline anomalies to share with a physician.",
    source: "ACOG Practice Bulletin on Menstrual Disorders"
  },
  {
    topics: ['pcos', 'polycystic'],
    text: "Polycystic Ovary Syndrome (PCOS) is a common endocrine disorder characterized by hormonal imbalances (elevated androgens), irregular periods, and small cysts on the ovaries. Symptoms include hirsutism, acne, weight fluctuations, and insulin resistance. Management typically includes insulin-sensitizing nutritional strategies, regular moderate exercise, stress mitigation, and targeted medical therapies under physician guidance.",
    source: "International PCOS Consensus Guidelines"
  },
  {
    topics: ['hormone', 'hormonal', 'estrogen', 'progesterone', 'lh', 'fsh'],
    text: "Women's health is guided by four primary hormones: Estrogen (builds uterine lining, boosts mood/energy), Progesterone (maintains lining, calms the nervous system), LH (triggers ovulation), and FSH (stimulates follicle growth). Fluctuations in these hormones regulate the menstrual cycle. Maintaining balanced blood sugar, reducing environmental endocrine disruptors, and managing stress support optimal hormonal health.",
    source: "Society for Endocrinology Clinical Resource"
  },
  {
    topics: ['general wellness', 'wellness', 'nutrition', 'exercise', 'health', 'lifestyle'],
    text: "Optimizing general women's wellness involves cycle-syncing nutrition and movement. Aligning high-intensity workouts with the follicular/ovulatory phases and restorative practices with the luteal/menstrual phases supports natural bio-rhythms. A diet rich in fiber, healthy fats, and high-quality protein helps stabilize hormones, manage stress levels, and maintain consistent daily energy.",
    source: "Harvard T.H. Chan School of Public Health"
  }
];

const FALLBACK_CHUNK = {
  text: "Thank you for your question. Grounded medical literature suggests that for most general health queries, the best course of action is to track your physiological baseline (such as cycle lengths, energy levels, and sleep patterns) and consult a primary care provider. Maintaining consistent sleep, balanced macronutrient intake, and moderate physical activity supports general wellness and hormonal stability.",
  source: "Grounded Clinical Consensus Manual"
};

const tenDaysAgoDefault = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const calculateCycleDay = (dateStr) => {
  if (!dateStr) return 1;
  const [year, month, day] = dateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 1;
  return (diffDays % 28) + 1;
};

const getPhaseAndColor = (day) => {
  if (day >= 1 && day <= 5) {
    return { phase: 'Menstrual', color: '#db2777' };
  } else if (day >= 6 && day <= 13) {
    return { phase: 'Follicular', color: '#7c3aed' };
  } else if (day >= 14 && day <= 17) {
    return { phase: 'Ovulatory', color: '#059669' };
  } else {
    return { phase: 'Luteal', color: '#d97706' };
  }
};

const getNextPeriodStartDate = (lastDateStr) => {
  if (!lastDateStr) return null;
  const [year, month, day] = lastDateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 28);
  return date;
};

const formatPredictionWindow = (lastDateStr) => {
  const start = getNextPeriodStartDate(lastDateStr);
  if (!start) return "N/A";
  const end = new Date(start);
  end.setDate(start.getDate() + 4);
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} – ${endStr}`;
};

const formatFertilityWindow = (lastDateStr) => {
  const nextPeriod = getNextPeriodStartDate(lastDateStr);
  if (!nextPeriod) return "N/A";
  const ovulation = new Date(nextPeriod);
  ovulation.setDate(nextPeriod.getDate() - 14);
  const startFertile = new Date(ovulation);
  startFertile.setDate(ovulation.getDate() - 5);
  
  const startStr = startFertile.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = ovulation.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const peakStr = ovulation.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} – ${endStr} (Peak: ${peakStr})`;
};

export default function ChatWindow({ onShowEmergency, onCrisisSOS }) {
  const suggestions = [
    "What are common symptoms of iron deficiency?",
    "Tell me about the follicular phase.",
    "Is irregular menstruation normal?"
  ];

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('femcare_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading messages from localStorage", e);
      }
    }
    return [
      {
        id: 1,
        sender: 'assistant',
        text: "Welcome to the FemCare RAG Assistant. Ask me any women's health question."
      }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('femcare_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend || !textToSend.trim()) return;

    const userMessage = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    setTimeout(() => {
      const query = textToSend.toLowerCase();

      // Crisis Safety Red-Flag Keywords check
      const RED_FLAG_KEYWORDS = [
        "severe bleeding",
        "soaking through pads",
        "excruciating pain",
        "fainting",
        "dizziness",
        "sudden sharp pain",
        "high fever",
        "emergency"
      ];
      const hasRedFlag = RED_FLAG_KEYWORDS.some(keyword => query.includes(keyword));

      if (hasRedFlag) {
        const emergencyMessage = {
          id: Date.now() + 1,
          sender: 'assistant',
          isEmergency: true,
          text: `URGENT MEDICAL ADVISORY: Based on your message, you may be experiencing symptoms that require prompt clinical evaluation.\n\nRecommended Action Steps:\n- Seek immediate professional medical attention.\n- Go to the nearest Urgent Care facility or Emergency Room (ER).\n- Do not delay seeking care.\n\nIf you are in severe distress, please call 911 (or your local emergency services hotline) immediately.`,
          citation: "FemCare Safety Protocol"
        };
        setMessages((prev) => [...prev, emergencyMessage]);
        setIsThinking(false);
        return;
      }

      let matchedChunk = null;
      for (const chunk of KNOWLEDGE_BASE) {
        if (chunk.topics.some(topic => query.includes(topic))) {
          matchedChunk = chunk;
          break;
        }
      }
      
      if (!matchedChunk) {
        matchedChunk = FALLBACK_CHUNK;
      }

      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: matchedChunk.text,
        citation: matchedChunk.source
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1000);
  };

  const handleGeneratePDF = () => {
    const lastPeriodDate = localStorage.getItem('femcare_last_period_date') || tenDaysAgoDefault;
    
    let cycleLogs = {};
    const savedLogs = localStorage.getItem('femcare_cycle_logs');
    if (savedLogs) {
      try {
        cycleLogs = JSON.parse(savedLogs);
      } catch (e) {
        console.error("Error loading cycle logs", e);
      }
    }

    const cycleDay = calculateCycleDay(lastPeriodDate);
    const phaseInfo = getPhaseAndColor(cycleDay);
    const nextPeriodStr = formatPredictionWindow(lastPeriodDate);
    const fertilityStr = formatFertilityWindow(lastPeriodDate);

    const dateGenerated = new Date().toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    const sortedLogDates = Object.keys(cycleLogs).sort((a, b) => new Date(b) - new Date(a));
    let symptomsTableHTML;
    if (sortedLogDates.length === 0) {
      symptomsTableHTML = `<p class="no-logs">No symptoms or flow levels logged in this cycle.</p>`;
    } else {
      symptomsTableHTML = `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Flow Intensity</th>
              <th>Logged Symptoms</th>
            </tr>
          </thead>
          <tbody>
            ${sortedLogDates.map(dateKey => {
              const entry = cycleLogs[dateKey];
              const flow = entry.flow || 'none';
              const symptoms = entry.symptoms && entry.symptoms.length > 0 
                ? entry.symptoms.join(', ') 
                : 'None';
              return `
                <tr>
                  <td><strong>${dateKey}</strong></td>
                  <td><span class="flow-badge flow-${flow}">${flow}</span></td>
                  <td>${symptoms}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    const chatHTML = messages.map(msg => {
      const isUser = msg.sender === 'user';
      const senderLabel = isUser ? 'Patient' : 'Clinical Assistant';
      const bubbleClass = isUser ? 'msg-user' : 'msg-assistant';
      const citationHTML = (!isUser && msg.citation) 
        ? `<div class="citation">Source: ${msg.citation}</div>` 
        : '';
      return `
        <div class="message-block ${bubbleClass}">
          <div class="msg-header">${senderLabel}</div>
          <div class="msg-text">${msg.text}</div>
          ${citationHTML}
        </div>
      `;
    }).join('');

    const reportHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>FemCare Clinical Summary Report</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #334155;
            line-height: 1.5;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
          }
          
          .report-header {
            border-bottom: 2px solid #db2777;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header-main {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .title-container h1 {
            color: #1e293b;
            font-size: 24px;
            margin: 0;
            font-weight: 800;
            letter-spacing: -0.025em;
          }
          .title-container p {
            color: #db2777;
            font-size: 14px;
            margin: 4px 0 0 0;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .meta-info {
            text-align: right;
            font-size: 12px;
            color: #64748b;
          }
          
          h2.section-title {
            font-size: 16px;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-top: 30px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
          }
          
          .grid-summary {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 20px;
          }
          .metric-card {
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            padding: 14px 16px;
          }
          .metric-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .metric-value {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
          }
          .phase-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 9999px;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
          }
          th, td {
            text-align: left;
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          th {
            background-color: #f8fafc;
            font-weight: 600;
            color: #475569;
          }
          .flow-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            text-transform: capitalize;
          }
          .flow-none { background-color: #f1f5f9; color: #64748b; }
          .flow-light { background-color: #fce7f3; color: #db2777; }
          .flow-medium { background-color: #fbcfe8; color: #be185d; }
          .flow-heavy { background-color: #f9a8d4; color: #9d174d; }
          
          .no-logs {
            font-size: 13px;
            color: #64748b;
            font-style: italic;
          }
          
          .chat-summary {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .message-block {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13px;
            page-break-inside: avoid;
          }
          .msg-user {
            background-color: #fff5f7;
            border-left: 4px solid #db2777;
          }
          .msg-assistant {
            background-color: #f8fafc;
            border-left: 4px solid #475569;
          }
          .msg-header {
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 4px;
            color: #475569;
          }
          .msg-user .msg-header {
            color: #be185d;
          }
          .msg-text {
            color: #1e293b;
            white-space: pre-wrap;
          }
          .citation {
            margin-top: 6px;
            font-size: 10px;
            font-weight: 600;
            color: #059669;
            background-color: #ecfdf5;
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
          }
          
          .report-footer {
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            font-weight: 500;
            letter-spacing: 0.025em;
            page-break-inside: avoid;
          }

          @media print {
            body {
              padding: 20px;
            }
            .metric-card {
              background-color: #ffffff !important;
              border: 1px solid #cbd5e1 !important;
            }
            .flow-badge {
              border: 1px solid #cbd5e1 !important;
            }
            .flow-none { background-color: #ffffff !important; color: #475569 !important; }
            .flow-light { background-color: #ffffff !important; color: #db2777 !important; }
            .flow-medium { background-color: #ffffff !important; color: #be185d !important; }
            .flow-heavy { background-color: #ffffff !important; color: #9d174d !important; }
            
            .msg-user {
              background-color: #ffffff !important;
              border: 1px solid #e2e8f0 !important;
              border-left: 4px solid #db2777 !important;
            }
            .msg-assistant {
              background-color: #ffffff !important;
              border: 1px solid #e2e8f0 !important;
              border-left: 4px solid #475569 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="header-main">
            <div class="title-container">
              <h1>FemCare Patient Health & Cycle Summary Report</h1>
              <p>Clinical Reference Summary</p>
            </div>
            <div class="meta-info">
              <div><strong>Generated:</strong> ${dateGenerated}</div>
              <div><strong>System Baseline:</strong> Active</div>
            </div>
          </div>
        </div>

        <h2 class="section-title">Current Cycle Status</h2>
        <div class="grid-summary">
          <div class="metric-card">
            <div class="metric-label">Last Period Start Date</div>
            <div class="metric-value">${lastPeriodDate}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Current Cycle Day & Phase</div>
            <div class="metric-value">
              Day ${cycleDay} &nbsp;•&nbsp; 
              <span class="phase-badge" style="background-color: ${phaseInfo.color};">${phaseInfo.phase}</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Estimated Next Period</div>
            <div class="metric-value">${nextPeriodStr}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Fertile Window Prediction</div>
            <div class="metric-value">${fertilityStr}</div>
          </div>
        </div>

        <h2 class="section-title">Symptom Log Overview</h2>
        ${symptomsTableHTML}

        <h2 class="section-title">Chat Q&A Summary</h2>
        <div class="chat-summary">
          ${chatHTML}
        </div>

        <div class="report-footer">
          Generated for Clinical Review with Healthcare Provider &bull; FemCare RAG Secure Assistant
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
      
      setTimeout(() => {
        if (printWindow.document.readyState === 'complete') {
          printWindow.focus();
          printWindow.print();
        }
      }, 500);
    } else {
      alert("Please allow popups to generate and print the clinical summary PDF.");
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'assistant',
        text: "Welcome to the FemCare RAG Assistant. Ask me any women's health question."
      }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-sage-card text-charcoal">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shadow-sm flex-shrink-0">
        <div>
          <h2 className="font-extrabold text-charcoal text-lg tracking-wide">Safe Women's Health Portal</h2>
          <p className="text-xs text-moss flex items-center font-semibold">
            <span className="w-2 h-2 rounded-full bg-moss inline-block mr-1.5 animate-pulse"></span>
            Grounded in Verified Medical Data
          </p>
        </div>

        {/* Chat Memory & Safety Controls */}
        <div className="flex items-center gap-3">
          {onCrisisSOS && (
            <button
              onClick={onCrisisSOS}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-650 hover:bg-red-750 text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex-shrink-0 animate-pulse"
            >
              🚨 Crisis SOS
            </button>
          )}
          {onShowEmergency && (
            <button
              onClick={onShowEmergency}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/60 hover:border-red-300 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex-shrink-0"
            >
              Test Safety Trigger 🚨
            </button>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sage-hover border border-sage-border text-moss rounded-full text-xs font-bold shadow-sm flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-moss inline-block animate-pulse"></span>
            Session Saved
          </div>
          <button
            onClick={handleGeneratePDF}
            className="bg-sage-hover border border-sage-border text-charcoal-muted hover:text-charcoal hover:bg-sage-bg px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Generate Doctor PDF
          </button>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sage-hover border border-sage-border text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Clear Chat
          </button>
        </div>
      </header>

      {/* Workspace / Chat history area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-sage-card">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col space-y-1.5 max-w-xl">
              <div className={`rounded-2xl p-4 shadow-sm leading-relaxed text-sm whitespace-pre-line border ${
                message.sender === 'user'
                  ? 'bg-moss text-white border-moss'
                  : message.isEmergency
                  ? 'bg-red-50 border-2 border-red-500 text-red-950 font-medium'
                  : 'bg-sage-bg border-sage-border text-charcoal'
              }`}>
                {message.sender === 'assistant' && message.id === 1 ? (
                  <span>Welcome to the <strong className="text-moss">FemCare RAG Assistant</strong>. Ask me any women's health question.</span>
                ) : message.isEmergency ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-700 font-bold">
                      <span className="text-xl">🚨</span>
                      <span>URGENT MEDICAL ADVISORY</span>
                    </div>
                    <p className="text-red-900 leading-relaxed font-semibold">
                      Based on your message, you may be experiencing symptoms that require prompt clinical evaluation.
                    </p>
                    <div className="bg-white/60 rounded-xl p-3 border border-red-200 text-xs text-red-950 space-y-2">
                      <p className="font-semibold text-[13px]">Recommended Action Steps:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Seek immediate professional medical attention.</li>
                        <li>Go to the nearest Urgent Care facility or Emergency Room (ER).</li>
                        <li>Do not delay seeking care based on information provided here.</li>
                      </ul>
                    </div>
                    <div className="text-red-800 text-[11px] font-bold mt-1 bg-red-100/40 p-2.5 rounded-lg border border-red-200/50">
                      📞 If you are in severe distress, please call 911 (or your local emergency services hotline) immediately.
                    </div>
                  </div>
                ) : (
                  message.text
                )}
              </div>
              {message.sender === 'assistant' && message.citation && (
                <div className="flex justify-start px-2">
                  <span className="text-[10px] font-bold text-moss bg-sage-hover border border-sage-border rounded px-2 py-0.5 shadow-sm uppercase tracking-wider">
                    Source: {message.citation}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-sage-bg border border-sage-border text-charcoal-muted max-w-xl rounded-2xl px-4 py-3.5 shadow-sm text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-moss animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-moss animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-moss animate-bounce"></span>
              <span className="text-xs ml-1 text-charcoal-muted font-semibold animate-pulse">FemCare is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips, Input area & Medical Disclaimer */}
      <div className="p-6 bg-sage-card border-t border-sage-border flex-shrink-0">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-xs bg-sage-hover hover:bg-sage-bg text-moss font-bold px-3.5 py-1.5 rounded-full border border-sage-border transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Form input */}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isThinking}
              placeholder="Ask a private women's health question..."
              className="w-full pl-5 pr-12 py-3.5 bg-sage-bg border border-sage-border rounded-xl focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card text-charcoal placeholder-charcoal-muted transition-all shadow-inner text-sm disabled:opacity-75"
            />
            <button
              type="submit"
              disabled={isThinking}
              className="absolute right-3 p-2 text-moss hover:scale-110 active:scale-95 transition-all rounded-lg cursor-pointer disabled:opacity-50"
            >
              🚀
            </button>
          </form>

          {/* Persistent Disclaimer (Moved from App.jsx for locking structure) */}
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}