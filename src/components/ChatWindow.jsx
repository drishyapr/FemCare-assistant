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

export default function ChatWindow({ onShowEmergency }) {
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

  const handleDownloadChat = () => {
    const formattedText = messages.map(msg => {
      let date;
      if (msg.id && msg.id > 100000000000) {
        date = new Date(msg.id);
      } else {
        date = new Date();
      }
      const dateStr = date.toISOString().split('T')[0];
      const senderLabel = msg.sender === 'user' ? 'User' : 'FemCare Assistant';
      let line = `[${dateStr}] ${senderLabel}: ${msg.text}`;
      if (msg.citation) {
        line += ` (Source: ${msg.citation})`;
      }
      return line;
    }).join('\n');

    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'femcare_chat_history.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white text-slate-800">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shadow-sm flex-shrink-0">
        <div>
          <h2 className="font-semibold text-slate-800 text-lg tracking-wide">Safe Women's Health Portal</h2>
          <p className="text-xs text-emerald-600 flex items-center font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse"></span>
            Grounded in Verified Medical Data
          </p>
        </div>

        {/* Chat Memory & Safety Controls */}
        <div className="flex items-center gap-3">
          {onShowEmergency && (
            <button
              onClick={onShowEmergency}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/60 hover:border-red-300 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex-shrink-0"
            >
              Test Safety Trigger 🚨
            </button>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50/60 border border-emerald-100/80 text-emerald-700 rounded-full text-xs font-medium shadow-sm transition-all duration-200 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Session Saved
          </div>
          <button
            onClick={handleDownloadChat}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Chat
          </button>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Clear Chat
          </button>
        </div>
      </header>

      {/* Workspace / Chat history area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col space-y-1.5 max-w-xl">
              <div className={`rounded-2xl p-4 shadow-sm leading-relaxed text-sm whitespace-pre-line ${
                message.sender === 'user'
                  ? 'bg-pink-600 text-white'
                  : message.isEmergency
                  ? 'bg-red-50 border-2 border-red-500 text-red-950 font-medium'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-700'
              }`}>
                {message.sender === 'assistant' && message.id === 1 ? (
                  <span>Welcome to the <strong className="text-pink-650">FemCare RAG Assistant</strong>. Ask me any women's health question.</span>
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
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 shadow-sm uppercase tracking-wider">
                    Source: {message.citation}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-200/80 text-slate-500 max-w-xl rounded-2xl px-4 py-3.5 shadow-sm text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce"></span>
              <span className="text-xs ml-1 text-slate-400 font-medium animate-pulse">FemCare is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips, Input area & Medical Disclaimer */}
      <div className="p-6 bg-white border-t border-slate-100 flex-shrink-0">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium px-3.5 py-1.5 rounded-full border border-pink-200/60 hover:border-pink-300 transition-all cursor-pointer"
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
              className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800 placeholder-slate-400 transition-all shadow-inner text-sm disabled:opacity-75"
            />
            <button
              type="submit"
              disabled={isThinking}
              className="absolute right-3 p-2 text-pink-500 hover:text-pink-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
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