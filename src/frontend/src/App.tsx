import { useCallback, useEffect, useRef, useState } from "react";

// ============================
// FLOATING HEARTS
// ============================
interface HeartParticle {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  emoji: string;
}

const HEART_EMOJIS = ["💗", "💕", "💓", "💖", "❤️", "🩷", "💝"];

function FloatingHearts() {
  const hearts: HeartParticle[] = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${(i * 4.2) % 100}%`,
    size: `${16 + (i % 5) * 8}px`,
    duration: `${8 + (i % 6) * 2}s`,
    delay: `${(i * 0.7) % 10}s`,
    emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-particle select-none"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
            opacity: 0,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

// ============================
// MUSIC PLAYER
// ============================
function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Try autoplay
    audio.volume = 0.5;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlaying(true);
          setStarted(true);
        })
        .catch(() => {
          // Autoplay blocked — user must interact
          setPlaying(false);
        });
    }
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
      setStarted(true);
    }
  };

  return (
    <>
      {/* biome-ignore lint/a11y/useMediaCaption: background music, no dialogue */}
      <audio
        ref={audioRef}
        src="/assets/uploads/don-019d2371-a322-7044-a03d-23d9cbb7c8b5-1.mp3"
        loop
        preload="auto"
      />
      <button
        type="button"
        onClick={toggle}
        title={playing ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95"
        style={{
          width: "52px",
          height: "52px",
          backgroundColor: playing ? "#C97A8F" : "rgba(255,255,255,0.85)",
          border: "2px solid #f0c8d4",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
        }}
      >
        <span className="text-2xl select-none">{playing ? "🎵" : "🔇"}</span>
        {!started && (
          <span
            className="absolute -top-1 -right-1 text-xs font-bold rounded-full flex items-center justify-center"
            style={{
              width: "18px",
              height: "18px",
              backgroundColor: "#FF85A1",
              color: "white",
            }}
          >
            !
          </span>
        )}
      </button>
    </>
  );
}

// ============================
// HEADER
// ============================
const SLIDE_NAMES = [
  "The Tease",
  "Balloon Reveal",
  "Cake Time",
  "Polaroids",
  "Surprise!",
];

function Header({
  currentSlide,
  onGoToSlide,
}: { currentSlide: number; onGoToSlide: (n: number) => void }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 shadow-sm"
      style={{
        backgroundColor: "#F6F0F2",
        borderBottom: "1.5px solid #f0c8d4",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">🧁</span>
        <span className="font-playfair font-bold text-bday-sub text-lg md:text-xl tracking-wide">
          Birthday Tribute
        </span>
      </div>
      <nav
        className="flex items-center gap-1 md:gap-2"
        aria-label="Slide navigation"
      >
        {SLIDE_NAMES.map((name, i) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: stable list
            key={i}
            type="button"
            data-ocid="nav.tab"
            onClick={() => onGoToSlide(i)}
            title={name}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all"
            style={{
              opacity: currentSlide === i ? 1 : 0.5,
            }}
          >
            <div
              className="rounded-full transition-all"
              style={{
                width: currentSlide === i ? "28px" : "8px",
                height: "8px",
                backgroundColor: currentSlide === i ? "#C97A8F" : "#e8a0b4",
              }}
            />
            <span
              className="hidden md:block text-xs font-nunito font-semibold"
              style={{ color: "#5a2d41" }}
            >
              {name}
            </span>
          </button>
        ))}
      </nav>
    </header>
  );
}

// ============================
// FOOTER
// ============================
function Footer() {
  return (
    <footer
      className="w-full py-8 flex flex-col items-center gap-3 mt-auto"
      style={{ backgroundColor: "#f9e0e9", borderTop: "1.5px solid #f0c8d4" }}
    >
      <div className="teddy-bounce text-5xl md:text-6xl select-none">
        🐻🤗🐻
      </div>
      <p
        className="font-playfair text-xl md:text-2xl text-center px-4"
        style={{ color: "#5a2d41" }}
      >
        I really love you my cupcake 🧁❤️
      </p>
      <p className="text-xs font-nunito" style={{ color: "#9a6070" }}>
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

// ============================
// SLIDE 1: THE TEASE
// ============================
function Slide1({ onAdvance }: { onAdvance: () => void }) {
  const [count, setCount] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [done, setDone] = useState(false);
  const advancedRef = useRef(false);

  useEffect(() => {
    if (done) return;
    if (count <= 0) {
      setDone(true);
      setTimeout(() => onAdvance(), 600);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, done, onAdvance]);

  const handleImpatient = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      onAdvance();
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 pt-20 pb-8">
      <div className="text-4xl select-none">✨ 🎉 ✨</div>

      <div className="text-center">
        <p
          className="font-nunito text-lg font-semibold mb-2"
          style={{ color: "#9a6070" }}
        >
          Something special is coming...
        </p>
        <h1
          className="font-playfair font-bold"
          style={{
            color: "#5a2d41",
            fontSize: "clamp(5rem, 20vw, 10rem)",
            lineHeight: 1,
          }}
        >
          {count}
        </h1>
        <p
          className="font-nunito text-2xl font-bold mt-2"
          style={{ color: "#c97a8f" }}
        >
          seconds
        </p>
      </div>

      <div
        className="rounded-2xl p-6 text-center shadow-pink max-w-sm w-full"
        style={{
          backgroundColor: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          border: "1.5px solid #f0c8d4",
        }}
      >
        <p
          className="font-playfair italic text-xl mb-1"
          style={{ color: "#5a2d41" }}
        >
          Wait for it...
        </p>
        <p className="font-nunito text-sm" style={{ color: "#9a6070" }}>
          Something truly special awaits 💖
        </p>
      </div>

      {!done && (
        <button
          type="button"
          className="bday-btn"
          data-ocid="slide1.primary_button"
          onClick={handleImpatient}
        >
          I don't have patience 🙄
        </button>
      )}

      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,209,220,0.85)" }}
        >
          <div
            className="rounded-3xl p-8 text-center shadow-xl message-fade max-w-sm mx-4"
            style={{ backgroundColor: "#fff5f7", border: "2px solid #f0c8d4" }}
            data-ocid="slide1.modal"
          >
            <div className="text-5xl mb-4">😉</div>
            <p
              className="font-playfair font-bold text-2xl mb-2"
              style={{ color: "#5a2d41" }}
            >
              Wait baccha!
            </p>
            <p className="font-nunito text-lg" style={{ color: "#9a6070" }}>
              There is something special for you! 😉
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================
// SLIDE 2: BALLOON REVEAL
// ============================
const BALLOON_WORDS = ["You", "are", "so", "cute!"];
const BALLOON_COLORS = ["#FF9EB5", "#FFB3C8", "#FF85A1", "#FFC8D8"];

function Slide2({ onAdvance }: { onAdvance: () => void }) {
  const [popped, setPopped] = useState<boolean[]>([false, false, false, false]);
  const [popping, setPopping] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const allPopped = popped.every(Boolean);

  const handlePop = (i: number) => {
    if (popped[i] || popping[i]) return;
    setPopping((prev) => {
      const n = [...prev];
      n[i] = true;
      return n;
    });
    setTimeout(() => {
      setPopped((prev) => {
        const n = [...prev];
        n[i] = true;
        return n;
      });
      setPopping((prev) => {
        const n = [...prev];
        n[i] = false;
        return n;
      });
    }, 400);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 pt-24 pb-8">
      <h2
        className="font-playfair font-bold text-3xl md:text-4xl text-center"
        style={{ color: "#5a2d41" }}
      >
        Pop the balloons! 🎈
      </h2>
      <p className="font-nunito text-base" style={{ color: "#9a6070" }}>
        Click each balloon to reveal a word
      </p>

      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {BALLOON_WORDS.map((word, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: stable list
          <div key={i} className="flex flex-col items-center gap-3">
            {!popped[i] ? (
              <button
                type="button"
                className={`text-7xl md:text-8xl select-none transition-all ${
                  popping[i] ? "balloon-pop" : "balloon-bob"
                } cursor-pointer`}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  animationDelay: `${i * 0.5}s`,
                }}
                onClick={() => handlePop(i)}
                data-ocid={`slide2.button.${i + 1}`}
                aria-label={`Pop balloon ${i + 1}`}
              >
                <span
                  style={{
                    filter: `drop-shadow(0 4px 8px ${BALLOON_COLORS[i]}88)`,
                  }}
                >
                  🎈
                </span>
              </button>
            ) : (
              <div
                className="word-reveal text-4xl md:text-5xl font-playfair font-bold flex items-center justify-center"
                style={{
                  color: "#5a2d41",
                  minWidth: "80px",
                  minHeight: "80px",
                  textShadow: "0 2px 8px rgba(90,45,65,0.2)",
                }}
              >
                ✨ {word}
              </div>
            )}
            {!popped[i] && (
              <div
                style={{
                  width: "2px",
                  height: "40px",
                  backgroundColor: "#e8a0b4",
                  opacity: 0.7,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {popped.some(Boolean) && !allPopped && (
        <div className="flex gap-3 flex-wrap justify-center">
          {BALLOON_WORDS.map((word, i) =>
            popped[i] ? (
              <span
                key={word}
                className="font-playfair font-bold text-2xl"
                style={{ color: "#5a2d41" }}
              >
                {word}
              </span>
            ) : (
              <span
                key={word}
                className="font-playfair text-2xl opacity-30"
                style={{ color: "#5a2d41" }}
              >
                __
              </span>
            ),
          )}
        </div>
      )}

      {allPopped && (
        <div
          className="message-fade rounded-3xl p-6 md:p-8 text-center max-w-xl w-full shadow-pink"
          style={{
            backgroundColor: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            border: "2px solid #f0c8d4",
          }}
          data-ocid="slide2.panel"
        >
          <div className="text-4xl mb-4">👑✨</div>
          <p
            className="font-playfair font-bold text-2xl md:text-3xl mb-4"
            style={{ color: "#5a2d41" }}
          >
            You are so cute!
          </p>
          <p
            className="font-nunito text-base md:text-lg leading-relaxed"
            style={{ color: "#6b3a50" }}
          >
            Happy Birthday to the girl who literally defines 'cuteness'! stop
            doubting yourself for even a second, because you are a masterpiece.
            I'm so lucky to have a front-row seat to your life. Today is all
            about you, and I'm here to make sure you feel like the queen you
            actually are. Let's make this year your best one yet! 👑✨
          </p>
          <button
            type="button"
            className="bday-btn mt-6"
            data-ocid="slide2.primary_button"
            onClick={onAdvance}
          >
            r u excited? 🎊
          </button>
        </div>
      )}
    </div>
  );
}

// ============================
// SLIDE 3: CAKE CEREMONY
// ============================
function CakeIllustration({ lit }: { lit: boolean }) {
  return (
    <svg
      width="220"
      height="260"
      viewBox="0 0 220 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Birthday cake illustration"
    >
      {[55, 110, 165].map((x, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable candle positions
        <g key={i}>
          <rect
            x={x - 8}
            y={50}
            width={16}
            height={55}
            rx={3}
            fill={i % 2 === 0 ? "#F5B8CB" : "#FFD580"}
          />
          <line x1={x} y1={55} x2={x} y2={50} stroke="#333" strokeWidth={2} />
          {lit ? (
            <g className="flame-flicker">
              <ellipse
                cx={x}
                cy={36}
                rx={8}
                ry={13}
                fill="#FF7A00"
                opacity={0.9}
              />
              <ellipse
                cx={x}
                cy={38}
                rx={5}
                ry={9}
                fill="#FFD700"
                opacity={0.95}
              />
              <ellipse cx={x} cy={40} rx={3} ry={5} fill="#FFF" opacity={0.8} />
            </g>
          ) : (
            <circle cx={x} cy={48} r={3} fill="#888" opacity={0.5} />
          )}
        </g>
      ))}
      <rect
        x={30}
        y={105}
        width={160}
        height={65}
        rx={12}
        fill="#FFCCD9"
        stroke="#e8a0b4"
        strokeWidth={2}
      />
      {[0, 1, 2, 3].map((d) => (
        <circle
          key={d}
          cx={55 + d * 37}
          cy={140}
          r={6}
          fill="#FF9EB5"
          opacity={0.7}
        />
      ))}
      <text
        x={110}
        y={148}
        textAnchor="middle"
        fontSize={12}
        fill="#C97A8F"
        fontFamily="Nunito"
        fontWeight="700"
      >
        Happy Birthday!
      </text>
      <rect
        x={10}
        y={168}
        width={200}
        height={75}
        rx={14}
        fill="#FFA3BF"
        stroke="#C97A8F"
        strokeWidth={2}
      />
      {[0, 1, 2, 3, 4].map((d) => (
        <path
          key={d}
          d={`M ${20 + d * 40} 185 Q ${30 + d * 40} 175 ${40 + d * 40} 185`}
          stroke="#fff"
          strokeWidth={3}
          fill="none"
          opacity={0.7}
        />
      ))}
      {[0, 1, 2, 3, 4].map((d) => (
        <circle
          key={d}
          cx={30 + d * 40}
          cy={210}
          r={5}
          fill="#FFD1DC"
          opacity={0.8}
        />
      ))}
      <ellipse
        cx={110}
        cy={245}
        rx={108}
        ry={12}
        fill="#f0c8d4"
        stroke="#e8a0b4"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function Slide3({ onAdvance }: { onAdvance: () => void }) {
  const [lit, setLit] = useState(false);
  const [blown, setBlown] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!lit) setLit(true);
  };

  const handleSimulateBlow = () => {
    setBlown(true);
    setShowComplete(true);
    setTimeout(() => onAdvance(), 2200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 pt-24 pb-8">
      <h2
        className="font-playfair font-bold text-3xl md:text-4xl text-center"
        style={{ color: "#5a2d41" }}
      >
        Light the candles! 🕯️
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-2xl">
        <div
          className={`candle-drop-zone flex flex-col items-center ${isDragOver ? "drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          data-ocid="slide3.canvas_target"
        >
          <CakeIllustration lit={lit && !blown} />
          {isDragOver && (
            <p
              className="font-nunito text-sm font-bold"
              style={{ color: "#C97A8F" }}
            >
              Drop here! 🔥
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-5">
          {!lit && (
            <div className="flex flex-col items-center gap-2">
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text", "lighter")}
                className="lighter-drag text-6xl select-none"
                data-ocid="slide3.drag_handle"
              >
                🔥
              </div>
              <p
                className="font-nunito text-sm font-semibold text-center"
                style={{ color: "#9a6070" }}
              >
                Drag me to the cake!
              </p>
              <button
                type="button"
                className="bday-btn text-sm px-4 py-2"
                data-ocid="slide3.secondary_button"
                onClick={() => setLit(true)}
              >
                Light the candles ✨
              </button>
            </div>
          )}

          {lit && !blown && (
            <div className="flex flex-col items-center gap-4 message-fade">
              <div className="text-4xl">🎤</div>
              <p
                className="font-playfair font-bold text-xl text-center"
                style={{ color: "#5a2d41" }}
              >
                Blow into the mic! 🎤
              </p>
              <p className="font-nunito text-sm" style={{ color: "#9a6070" }}>
                Make a wish first...
              </p>
              <button
                type="button"
                className="bday-btn"
                data-ocid="slide3.primary_button"
                onClick={handleSimulateBlow}
              >
                Simulate Blowing 💨
              </button>
            </div>
          )}
        </div>
      </div>

      {showComplete && (
        <div
          className="message-fade rounded-3xl p-6 text-center shadow-pink"
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            border: "2px solid #f0c8d4",
          }}
          data-ocid="slide3.success_state"
        >
          <div className="text-5xl mb-3">🎂</div>
          <p
            className="font-playfair font-bold text-2xl"
            style={{ color: "#5a2d41" }}
          >
            Happy birthday cutie! 🎂
          </p>
          <p className="font-nunito text-sm mt-2" style={{ color: "#9a6070" }}>
            Moving to the next surprise...
          </p>
        </div>
      )}
    </div>
  );
}

// ============================
// SLIDE 4: POLAROIDS
// ============================
const POLAROID_DATA = [
  {
    src: "/assets/uploads/smiley4.jpg-019d2346-9602-7189-847f-81c986810778-2.jpeg",
    caption: "Smiley ✨",
    rotate: "-3deg",
    message: "Wait... how can one person be this photogenic? Stop it! 😍",
  },
  {
    src: "/assets/uploads/smiley1.jpg-019d2346-9624-7223-8a1f-0e9118670670-3.jpeg",
    caption: "Pure Joy 💕",
    rotate: "2deg",
    message: "This smile? It's literally my favorite thing in the world. ✨",
  },
  {
    src: "/assets/uploads/smiley3.jpg-019d2346-9678-75ae-9fc4-872b6b44c641-4.jpeg",
    caption: "Queen 👑",
    rotate: "-1deg",
    message: "Absolute Queen energy. You're outshining everyone! 💅",
  },
  {
    src: "/assets/uploads/smiley2.jpg-019d2346-9522-74de-a17e-c43315c2357b-1.jpeg",
    caption: "Beautiful 💖",
    rotate: "3deg",
    message:
      "Beautiful inside and out. I hope you see yourself the way I see you. 💖",
  },
];

function PolaroidImage({
  src,
  caption,
  large,
}: { src: string; caption: string; large?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const size = large ? 280 : 134;

  return imgError ? (
    <div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: "#FFD1DC",
        borderRadius: "4px",
      }}
    >
      <span className="text-4xl">💗</span>
    </div>
  ) : (
    <img
      src={src}
      alt={caption}
      className="object-cover"
      style={{
        width: size,
        height: size,
        borderRadius: "4px",
        display: "block",
      }}
      onError={() => setImgError(true)}
    />
  );
}

function PolaroidCard({
  data,
  index,
  onClick,
}: { data: (typeof POLAROID_DATA)[0]; index: number; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex flex-col items-center cursor-pointer"
      style={{
        transform: `rotate(${data.rotate})`,
        background: "none",
        border: "none",
        padding: 0,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onClick={onClick}
      data-ocid={`slide4.button.${index + 1}`}
    >
      <div
        className="bg-white p-3 pb-10 shadow-polaroid"
        style={{ width: "160px", borderRadius: "4px" }}
      >
        <PolaroidImage src={data.src} caption={data.caption} />
        <p
          className="text-center mt-2 font-playfair italic text-sm"
          style={{ color: "#5a2d41" }}
        >
          {data.caption}
        </p>
      </div>
    </button>
  );
}

function Slide4({ onAdvance }: { onAdvance: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  const closeModal = () => setSelected(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 pt-24 pb-8">
      <h2
        className="font-playfair font-bold text-3xl md:text-4xl text-center"
        style={{ color: "#5a2d41" }}
      >
        Aesthetic Moments 📸
      </h2>
      <p className="font-nunito text-base" style={{ color: "#9a6070" }}>
        Click a photo to see a message 💌
      </p>

      <div className="flex flex-wrap justify-center gap-8 md:gap-10">
        {POLAROID_DATA.map((d, i) => (
          <PolaroidCard
            key={d.src}
            data={d}
            index={i}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>

      <button
        type="button"
        className="bday-btn mt-4"
        data-ocid="slide4.primary_button"
        onClick={onAdvance}
      >
        The Final Surprise... 🎁
      </button>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(90,45,65,0.7)",
            backdropFilter: "blur(8px)",
          }}
          data-ocid="slide4.modal"
        >
          <div
            className="polaroid-zoom-in bg-white p-4 pb-12 shadow-2xl w-full text-center relative"
            style={{ borderRadius: "6px", maxWidth: "340px" }}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-xl font-bold"
              style={{
                color: "#C97A8F",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={closeModal}
              data-ocid="slide4.close_button"
              aria-label="Close"
            >
              ✕
            </button>
            <PolaroidImage
              src={POLAROID_DATA[selected].src}
              caption={POLAROID_DATA[selected].caption}
              large
            />
            <p
              className="font-playfair italic mt-4 leading-relaxed"
              style={{ color: "#5a2d41", fontSize: "1rem" }}
            >
              {POLAROID_DATA[selected].message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================
// SLIDE 5: FINAL SURPRISE
// ============================
interface ConfettiPiece {
  id: number;
  tx: string;
  ty: string;
  rot: string;
  left: string;
  top: string;
  emoji: string;
}

function Slide5() {
  const [opened, setOpened] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const handleOpen = useCallback(() => {
    if (opened) return;
    setOpened(true);
    const pieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      tx: `${(Math.random() - 0.5) * 300}px`,
      ty: `${-(Math.random() * 200 + 50)}px`,
      rot: `${(Math.random() - 0.5) * 720}deg`,
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 40 + 30}%`,
      emoji: ["💗", "⭐", "✨", "🌸", "💫"][i % 5],
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 1500);
  }, [opened]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 pt-24 pb-8 relative">
      <h2
        className="font-playfair font-bold text-3xl md:text-4xl text-center"
        style={{ color: "#5a2d41" }}
      >
        Your Final Surprise 🎁
      </h2>

      {confetti.map((p) => (
        <span
          key={p.id}
          className="confetti-piece pointer-events-none text-lg select-none"
          style={
            {
              left: p.left,
              top: p.top,
              "--tx": p.tx,
              "--ty": p.ty,
              "--rot": p.rot,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}

      {!opened ? (
        <button
          type="button"
          className="gift-pulse flex flex-col items-center gap-3"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          onClick={handleOpen}
          data-ocid="slide5.primary_button"
        >
          <GiftBox />
          <p
            className="font-nunito font-bold text-base"
            style={{ color: "#C97A8F" }}
          >
            Click to open! 👆
          </p>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex flex-col items-center">
            <div className="lid-fly absolute -top-4">
              <GiftLid />
            </div>
            <GiftBoxBody />
          </div>

          <div className="bear-pop text-center">
            <div className="text-8xl md:text-9xl select-none">🐻</div>
          </div>

          <div
            className="message-fade rounded-3xl p-6 md:p-8 text-center max-w-2xl w-full shadow-pink"
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              border: "2px solid #f0c8d4",
            }}
            data-ocid="slide5.panel"
          >
            <div className="text-4xl mb-4">🧸❤️</div>
            <p
              className="font-playfair font-bold text-2xl mb-6"
              style={{ color: "#5a2d41" }}
            >
              Happy Birthday, cutie. 🧸❤️
            </p>
            <div className="space-y-4 text-left">
              <p
                className="font-nunito text-base md:text-lg leading-relaxed"
                style={{ color: "#6b3a50" }}
              >
                Who would have thought that a random 18th of January would turn
                into the most important day of my year? From that first hello to
                this 3rd of April, time has flown by in a way I can't even
                explain. You became my 'home' before I even realized it was
                happening.
              </p>
              <p
                className="font-nunito text-base md:text-lg leading-relaxed"
                style={{ color: "#6b3a50" }}
              >
                I never imagined someone could become this special to me, but
                here you are—the person I want to share every sunrise and every
                silence with. Thank you for walking into my life and staying. On
                your birthday, I want to promise you one thing: no matter where
                life takes us, I am staying right here by your side. You are the
                kindest, rarest, and most beautiful soul I've ever known.
              </p>
              <p
                className="font-nunito text-base md:text-lg leading-relaxed"
                style={{ color: "#6b3a50" }}
              >
                I don't just want to celebrate today with you; I want to be
                there for every tomorrow, too. You're my favorite person, my
                safest place, and my greatest blessing. Happy Birthday, cutie. I
                hope you stay in my life forever. 🧸❤️
              </p>
            </div>
            <div className="mt-6 text-3xl">✨🎂✨</div>
          </div>
        </div>
      )}
    </div>
  );
}

function GiftBox() {
  return (
    <svg
      width="180"
      height="200"
      viewBox="0 0 180 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gift box"
    >
      <rect
        x="10"
        y="50"
        width="160"
        height="35"
        rx="6"
        fill="#FF85A1"
        stroke="#C97A8F"
        strokeWidth="2"
      />
      <rect x="82" y="50" width="16" height="35" fill="#FFD700" opacity="0.9" />
      <ellipse
        cx="60"
        cy="55"
        rx="28"
        ry="14"
        fill="#FFD700"
        opacity="0.9"
        transform="rotate(-25 60 55)"
      />
      <ellipse
        cx="120"
        cy="55"
        rx="28"
        ry="14"
        fill="#FFD700"
        opacity="0.9"
        transform="rotate(25 120 55)"
      />
      <circle cx="90" cy="52" r="10" fill="#FFA500" />
      <rect
        x="10"
        y="85"
        width="160"
        height="105"
        rx="8"
        fill="#FFCCD9"
        stroke="#C97A8F"
        strokeWidth="2"
      />
      <rect
        x="82"
        y="85"
        width="16"
        height="105"
        fill="#FFD700"
        opacity="0.7"
      />
      <text x="45" y="150" fontSize="20" fill="#C97A8F" opacity="0.6">
        💗
      </text>
      <text x="110" y="150" fontSize="20" fill="#C97A8F" opacity="0.6">
        💗
      </text>
      <text x="75" y="180" fontSize="18" fill="#C97A8F" opacity="0.5">
        ✨
      </text>
    </svg>
  );
}

function GiftLid() {
  return (
    <svg
      width="180"
      height="60"
      viewBox="0 0 180 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gift lid"
    >
      <rect
        x="10"
        y="25"
        width="160"
        height="35"
        rx="6"
        fill="#FF85A1"
        stroke="#C97A8F"
        strokeWidth="2"
      />
      <rect x="82" y="25" width="16" height="35" fill="#FFD700" opacity="0.9" />
      <ellipse
        cx="60"
        cy="28"
        rx="28"
        ry="14"
        fill="#FFD700"
        opacity="0.9"
        transform="rotate(-25 60 28)"
      />
      <ellipse
        cx="120"
        cy="28"
        rx="28"
        ry="14"
        fill="#FFD700"
        opacity="0.9"
        transform="rotate(25 120 28)"
      />
      <circle cx="90" cy="24" r="10" fill="#FFA500" />
    </svg>
  );
}

function GiftBoxBody() {
  return (
    <svg
      width="180"
      height="120"
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Open gift box body"
    >
      <rect
        x="10"
        y="10"
        width="160"
        height="105"
        rx="8"
        fill="#FFCCD9"
        stroke="#C97A8F"
        strokeWidth="2"
      />
      <rect
        x="82"
        y="10"
        width="16"
        height="105"
        fill="#FFD700"
        opacity="0.7"
      />
    </svg>
  );
}

// ============================
// MAIN APP
// ============================
export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  const goToSlide = (n: number) => {
    if (isTransitioning || n === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(n);
      setKey((k) => k + 1);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const advance = () => goToSlide(currentSlide + 1);

  const slides = [
    <Slide1 key={`s1-${key}`} onAdvance={advance} />,
    <Slide2 key={`s2-${key}`} onAdvance={advance} />,
    <Slide3 key={`s3-${key}`} onAdvance={advance} />,
    <Slide4 key={`s4-${key}`} onAdvance={advance} />,
    <Slide5 key={`s5-${key}`} />,
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FFD1DC", fontFamily: "'Nunito', sans-serif" }}
    >
      <FloatingHearts />
      <MusicPlayer />
      <Header currentSlide={currentSlide} onGoToSlide={goToSlide} />

      <main
        className="flex-1 relative z-10"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
        data-ocid="main.section"
      >
        <div className="slide-enter">{slides[currentSlide]}</div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
