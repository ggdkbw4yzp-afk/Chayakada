import React, {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  useRef,
} from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

// Explicit type definitions for pristine cinematic CSS layout processing
type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type BoxSizing = "border-box" | "content-box";

interface CoffeeBean {
  title: string;
  lines: string[];
}

export default function App() {
  const [page, setPage] = useState<string>("splash");
  const [cart, setCart] = useState<string[]>([]);
  const [valuation, setValuation] = useState<number>(4.2);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [callbackStatus, setCallbackStatus] = useState<string>(" ");
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  // Expanded interaction tracking states for Showcase cards
  const [activeCardPlus, setActiveCardPlus] = useState<string | null>(null);

  // Trailer Scrubbing Mode Variables
  const [isTrailerActive, setIsTrailerActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const DISCORD_LINK = "https://discord.gg/jpbcFnNfb2";

  // Framework setup for tracking the scroll container element height
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  // Create a highly responsive spring effect for smooth frame transition scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.5,
  });

  // Update video playback time based on spring-smoothed scroll timeline calculation
  useEffect(() => {
    return smoothProgress.onChange((latestProgress) => {
      if (isTrailerActive && videoRef.current && videoRef.current.duration) {
        // Map 0-1 percentage scroll to the video's full length duration parameters
        videoRef.current.currentTime =
          latestProgress * videoRef.current.duration;
      }
    });
  }, [isTrailerActive, smoothProgress]);

  // Cart operations
  const addToCart = (item: string) => {
    setCart((c) => [...c, item]);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart((c) => c.filter((_, index) => index !== indexToRemove));
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedVideo(URL.createObjectURL(file));
    }
  };

  // Live valuation loop
  useEffect(() => {
    const t = setInterval(() => {
      setValuation((v) => +(v + Math.random() * 0.02).toFixed(2));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  // Splash display screen timer
  useEffect(() => {
    if (page === "splash") {
      const t = setTimeout(() => setPage("home"), 1800);
      return () => clearTimeout(t);
    }
  }, [page]);

  const handleCallbackSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      setCallbackStatus("Auto-login parameters set. Check your DMs.");
    }
  };

  // --- MODERN LIGHT DESIGN CODES ---
  const bgLight: React.CSSProperties = {
    background: "#F5F5F7",
    color: "#1D1D1F",
    minHeight: "100vh",
    padding: "50px 20px",
    fontFamily:
      'system-ui, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
    transition: "background 0.5s ease, color 0.5s ease",
    display: "flex",
    flexDirection: "column" as FlexDirection,
    justifyContent: "space-between",
  };

  const cardLight: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    borderRadius: 22,
    padding: 28,
    marginBottom: 24,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.015)",
  };

  const btnLight: React.CSSProperties = {
    padding: "12px 24px",
    borderRadius: 999,
    border: "none",
    background: "#0071E3",
    color: "#FFFFFF",
    fontWeight: "500",
    cursor: "pointer",
    display: "inline-block",
    fontSize: "0.95rem",
    letterSpacing: "-0.01em",
  };

  const btnSecondaryLight: React.CSSProperties = {
    ...btnLight,
    background: "rgba(0, 0, 0, 0.04)",
    color: "#0071E3",
    backdropFilter: "blur(10px)",
  };

  const inputLight: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid #D2D2D7",
    background: "rgba(255, 255, 255, 0.8)",
    color: "#1D1D1F",
    fontSize: "1rem",
    marginTop: 12,
    boxSizing: "border-box" as BoxSizing,
    outline: "none",
  };

  // --- PREMIUM DARK STYLES ---
  const bgDark: React.CSSProperties = {
    ...bgLight,
    background: "#000000",
    color: "#F5F5F7",
  };

  const cardDark: React.CSSProperties = {
    background: "#1D1D1F",
    border: "1px solid #333336",
    borderRadius: 22,
    padding: 28,
    marginBottom: 24,
  };

  const btnDark: React.CSSProperties = {
    ...btnLight,
    background: "#FFFFFF",
    color: "#000000",
  };

  const btnSecondaryDark: React.CSSProperties = {
    ...btnSecondaryLight,
    background: "#333336",
    border: "1px solid #424245",
    color: "#FFFFFF",
  };

  const inputDark: React.CSSProperties = {
    ...inputLight,
    background: "#1D1D1F",
    border: "1px solid #424245",
    color: "#FFFFFF",
  };

  const isPremium = page === "premium";
  const themeBg = isPremium ? bgDark : bgLight;
  const themeCard = isPremium ? cardDark : cardLight;
  const themeBtn = isPremium ? btnDark : btnLight;
  const themeBtnSec = isPremium ? btnSecondaryDark : btnSecondaryLight;
  const themeInput = isPremium ? inputDark : inputLight;

  const renderCartHeaderButton = () => {
    if (page === "splash" || page === "checkout" || isTrailerActive)
      return null;
    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={{
          ...themeBtn,
          background: cart.length > 0 ? "#34C759" : "#86868B",
          color: "#FFF",
        }}
        onClick={() => setPage("checkout")}
      >
        🛒 View Queue ({cart.length})
      </motion.button>
    );
  };

  const beans: CoffeeBean[] = [
    {
      title: "☕ Soft Launch Beans",
      lines: [
        "“Every empire starts mild.”",
        "“Smooth entry. No damage detected.”",
      ],
    },
    {
      title: "⚡ Main Character Roast",
      lines: [
        "“Confidence, artificially enhanced.”",
        "“You walk differently after this.”",
      ],
    },
    {
      title: "🌸 Angel Drip Beans",
      lines: [
        "“Looks innocent. Feels suspiciously emotional.”",
        "“Soft taste. Hard impact.”",
      ],
    },
    {
      title: "🔥 Backbench Blend",
      lines: [
        "“Chaos in liquid form.”",
        "“Not responsible for behavior after consumption.”",
      ],
    },
    {
      title: "🌿 Clean Boy Protocol",
      lines: [
        "“Temporary discipline in a cup.”",
        "“You will feel organized. Briefly.”",
      ],
    },
    {
      title: "🥛 Milky Situation",
      lines: ["“Too smooth to trust.”", "“Questions will arise.”"],
    },
    {
      title: "👑 CEO Roast",
      lines: [
        "“Silence becomes your default language.”",
        "“Decisions feel easier. Power feels normal.”",
      ],
    },
    {
      title: "🧠 Overthinking Fuel",
      lines: [
        "“Best consumed at your own risk.”",
        "“Thoughts will multiply. So will ambition.”",
      ],
    },
    {
      title: "⚙️ Special Sauce™ Core",
      lines: [
        "“No one knows what’s inside.”",
        "“Everyone keeps coming back anyway.”",
      ],
    },
  ];

  if (page === "splash") {
    return (
      <div
        style={{
          ...bgLight,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
          color: "#FFF",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          style={{
            fontSize: "3.5rem",
            fontWeight: 700,
            letterSpacing: "-0.05em",
          }}
        >
          Ani-Corp
        </motion.h1>
      </div>
    );
  }

  return (
    <div style={themeBg}>
      {/* Cinematic Fullscreen Scroll Video Layer Overlay */}
      <AnimatePresence>
        {isTrailerActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              background: "#000000",
              overflow: "hidden",
            }}
          >
            {/* The actual sticky fixed background video layout */}
            <video
              ref={videoRef}
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              playsInline
              muted
              preload="auto"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            />

            {/* Simulated virtual giant scrolling scroll-track container element inside the frame view */}
            <div
              ref={scrollContainerRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflowY: "scroll",
                scrollSnapType: "y mandatory",
              }}
            >
              {/* Virtual tall baseline track blocks to translate wheel scroll mechanics to numeric timeline parameters */}
              <div style={{ height: "400vh", width: "100%" }}>
                <div
                  style={{
                    position: "sticky",
                    top: 40,
                    left: 40,
                    zIndex: 10000,
                    padding: 20,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    style={{
                      ...btnLight,
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(20px)",
                      color: "#FFF",
                    }}
                    onClick={() => setIsTrailerActive(false)}
                  >
                    ✕ Close Cinematic Layout
                  </motion.button>
                </div>

                {/* Overlaid Title Nodes mapped directly along the scrolling process pipeline */}
                <div
                  style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    scrollSnapAlign: "start",
                  }}
                >
                  <h2
                    style={{
                      color: "#FFF",
                      fontSize: "3rem",
                      textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                      fontWeight: 700,
                    }}
                  >
                    Scroll to Play
                  </h2>
                </div>
                <div
                  style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    scrollSnapAlign: "start",
                  }}
                >
                  <h2
                    style={{
                      color: "#FFF",
                      fontSize: "3rem",
                      textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                      fontWeight: 700,
                    }}
                  >
                    Restructuring Beverage Systems
                  </h2>
                </div>
                <div
                  style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    scrollSnapAlign: "start",
                  }}
                >
                  <h2
                    style={{
                      color: "#FFF",
                      fontSize: "3rem",
                      textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                      fontWeight: 700,
                    }}
                  >
                    Ani-Corp Production Ecosystem
                  </h2>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
          paddingBottom: 60,
        }}
      >
        {/* Navigation Header Elements */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          {page !== "home" && !isTrailerActive ? (
            <motion.button
              whileHover={{ x: -4 }}
              style={{ ...themeBtnSec, fontSize: "0.9rem" }}
              onClick={() => setPage("home")}
            >
              ← Back
            </motion.button>
          ) : (
            <div />
          )}
          {renderCartHeaderButton()}
        </div>

        <AnimatePresence mode="wait">
          {page === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  marginBottom: 8,
                }}
              >
                Aniketh’s Chayakada
              </h1>
              <p
                style={{
                  color: "#86868B",
                  fontSize: "1.2rem",
                  marginBottom: 30,
                }}
              >
                Owned by Ani-Corp • CUPERTINO 🌴
              </p>
              <p
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 500,
                  marginBottom: 50,
                }}
              >
                Live Valuation:{" "}
                <span style={{ color: "#0071E3", fontWeight: 600 }}>
                  ${valuation}M
                </span>
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 24,
                  marginBottom: 60,
                }}
              >
                {[
                  {
                    id: "tea",
                    title: "☕ Tea System",
                    desc: "Custom structural blends",
                  },
                  {
                    id: "beans",
                    title: "🌿 Coffee Beans",
                    desc: "Suspiciously effective roasts",
                  },
                  {
                    id: "specs",
                    title: "🧾 Chaya Specs",
                    desc: "Technical documentation metrics",
                  },
                  {
                    id: "premium",
                    title: "👑 Premium Lounge",
                    desc: "Sufficient aura configurations",
                  },
                  {
                    id: "about",
                    title: "ℹ️ About Node",
                    desc: "Corporate documentation",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{
                      y: -6,
                      boxShadow: "0 12px 30px rgba(0,0,0,0.04)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={cardLight}
                    onClick={() => setPage(item.id)}
                  >
                    <h3
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        color: "#86868B",
                        margin: 0,
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* --- OVERVIEW SHOWCASE SECTION: WHY ANIKETHS CHAYAKADA IS THE BEST PLACE TO BUY --- */}
              <div style={{ marginTop: 80, marginBottom: 40 }}>
                <h2
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    marginBottom: 32,
                    color: "#1D1D1F",
                  }}
                >
                  Why Aniketh’s Chayakada is the best place to buy
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 24,
                  }}
                >
                  {/* CARD 1: WAYS TO BUY */}
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 28,
                      padding: "40px 30px",
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.03)",
                      minHeight: "480px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "#1D1D1F",
                          marginBottom: 10,
                        }}
                      >
                        Ways to Buy
                      </span>
                      <h3
                        style={{
                          fontSize: "2.3rem",
                          fontWeight: 700,
                          letterSpacing: "-0.03em",
                          lineHeight: 1.1,
                          marginBottom: 14,
                          color: "#1D1D1F",
                        }}
                      >
                        Pay over time,
                        <br />
                        interest-free.
                      </h3>
                      <p
                        style={{
                          fontSize: "1.05rem",
                          color: "#86868B",
                          lineHeight: 1.4,
                          margin: 0,
                        }}
                      >
                        When you choose to check out at Aniketh’s Chayakada with
                        Aniketh’s Chayakada Card Monthly Installments.
                      </p>
                    </div>

                    {/* Interactive inner layer panel showing items if Plus clicked */}
                    {page === "education" && (
                      <motion.div
                        key="education"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ maxWidth: 600, margin: "0 auto" }}
                      >
                        <h1
                          style={{
                            fontSize: "2.8rem",
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            marginBottom: 10,
                          }}
                        >
                          🎓 Educational Discounts
                        </h1>

                        <p style={{ color: "#86868B", marginBottom: 30 }}>
                          Verify your student status to unlock discounted access
                          tiers.
                        </p>

                        <div style={themeCard}>
                          <form onSubmit={verifyStudent}>
                            <label>Student Email</label>
                            <input
                              style={themeInput}
                              type="email"
                              placeholder="yourname@university.edu"
                              value={studentEmail}
                              onChange={(e) => setStudentEmail(e.target.value)}
                            />

                            <label style={{ marginTop: 12, display: "block" }}>
                              School / Institution
                            </label>
                            <input
                              style={themeInput}
                              type="text"
                              placeholder="University / School name"
                              value={studentSchool}
                              onChange={(e) => setStudentSchool(e.target.value)}
                            />

                            <motion.button
                              style={{ ...themeBtn, marginTop: 20 }}
                              type="submit"
                            >
                              Verify Student Status
                            </motion.button>
                          </form>

                          {discountMessage && (
                            <div
                              style={{
                                marginTop: 20,
                                fontWeight: 600,
                                color: isStudentVerified
                                  ? "#30D158"
                                  : "#FF453A",
                              }}
                            >
                              {discountMessage}
                            </div>
                          )}

                          {isStudentVerified && (
                            <div
                              style={{
                                marginTop: 15,
                                padding: 12,
                                borderRadius: 10,
                                background: "rgba(0,113,227,0.08)",
                                color: "#0071E3",
                                fontWeight: 600,
                              }}
                            >
                              Active Discount: {(discountRate * 100).toFixed(0)}
                              %
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                    <AnimatePresence>
                      {activeCardPlus === "waysToBuy" && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(255, 255, 255, 0.98)",
                            backdropFilter: "blur(10px)",
                            padding: 30,
                            zIndex: 10,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <h4
                            style={{
                              fontSize: "1.3rem",
                              fontWeight: 700,
                              marginBottom: 15,
                            }}
                          >
                            Select Financing Layer
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                            }}
                          >
                            <button
                              style={{
                                ...btnLight,
                                fontSize: "0.85rem",
                                padding: "10px 16px",
                              }}
                              onClick={() =>
                                addToCart("PRO PASS — ANIKETH ACCESS™")
                              }
                            >
                              Add Pro Pass to Queue (8 AED)
                            </button>
                            <button
                              style={{
                                ...btnLight,
                                background: "#1D1D1F",
                                fontSize: "0.85rem",
                                padding: "10px 16px",
                              }}
                              onClick={() => addToCart("PREMIUM — BLACK CARD™")}
                            >
                              Add Premium Black Card (14 AED)
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px 0",
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut",
                        }}
                        style={{
                          width: "220px",
                          height: "135px",
                          background:
                            "linear-gradient(135deg, #E2E2E5 0%, #F5F5F7 100%)",
                          borderRadius: 12,
                          padding: 16,
                          boxShadow: "0 15px 30px rgba(0,0,0,0.05)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          transform: "rotate(-6deg)",
                          border: "1px solid rgba(0,0,0,0.06)",
                          position: "relative",
                        }}
                      >
                        <div style={{ fontSize: "2.5rem", userSelect: "none" }}>
                          💳
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#6E6E73",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                          }}
                        >
                          MARISA ROBERTSON
                        </div>
                      </motion.div>
                    </div>

                    <div
                      onClick={() =>
                        setActiveCardPlus(
                          activeCardPlus === "waysToBuy" ? null : "waysToBuy"
                        )
                      }
                      style={{
                        position: "absolute",
                        bottom: 24,
                        right: 24,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#1D1D1F",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#FFF",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        zIndex: 11,
                      }}
                    >
                      {activeCardPlus === "waysToBuy" ? "✕" : "+"}
                    </div>
                  </motion.div>

                  {/* CARD 2: DELIVERY AND PICKUP */}
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 28,
                      padding: "40px 30px",
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.03)",
                      minHeight: "480px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "#86868B",
                          marginBottom: 10,
                        }}
                      >
                        Delivery and Pickup
                      </span>
                      <h3
                        style={{
                          fontSize: "2.3rem",
                          fontWeight: 700,
                          letterSpacing: "-0.03em",
                          lineHeight: 1.1,
                          marginBottom: 14,
                          color: "#1D1D1F",
                        }}
                      >
                        Get flexible delivery and easy pickup.
                      </h3>
                      <p
                        style={{
                          fontSize: "1.05rem",
                          color: "#86868B",
                          lineHeight: 1.4,
                          margin: 0,
                        }}
                      >
                        Choose two-hour instant thermal node delivery from a
                        local Chayakada hub, or convenient counter pickup
                        protocols.
                      </p>
                    </div>

                    <AnimatePresence>
                      {activeCardPlus === "delivery" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(255, 255, 255, 0.98)",
                            padding: 30,
                            zIndex: 10,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <h4
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              marginBottom: 10,
                            }}
                          >
                            Logistics Integration
                          </h4>
                          <p
                            style={{
                              fontSize: "0.95rem",
                              color: "#6E6E73",
                              lineHeight: 1.5,
                            }}
                          >
                            Every single container package leaves our processing
                            terminal within 90 seconds of ticket compilation.
                            Temperature alignment is strictly guaranteed.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px 0",
                        fontSize: "5.5rem",
                      }}
                    >
                      🛍️
                    </div>

                    <div
                      onClick={() =>
                        setActiveCardPlus(
                          activeCardPlus === "delivery" ? null : "delivery"
                        )
                      }
                      style={{
                        position: "absolute",
                        bottom: 24,
                        right: 24,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#1D1D1F",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#FFF",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        zIndex: 11,
                      }}
                    >
                      {activeCardPlus === "delivery" ? "✕" : "+"}
                    </div>
                  </motion.div>

                  {/* CARD 3: GUIDED SHOPPING */}
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 28,
                      padding: "40px 30px",
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.03)",
                      minHeight: "480px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "#86868B",
                          marginBottom: 10,
                        }}
                      >
                        Guided Shopping
                      </span>
                      <h3
                        style={{
                          fontSize: "2.3rem",
                          fontWeight: 700,
                          letterSpacing: "-0.03em",
                          lineHeight: 1.1,
                          marginBottom: 14,
                          color: "#1D1D1F",
                        }}
                      >
                        Shop live with a Specialist.
                      </h3>
                      <p
                        style={{
                          fontSize: "1.05rem",
                          color: "#86868B",
                          lineHeight: 1.4,
                          margin: 0,
                        }}
                      >
                        Let us help you find what you need and answer all your
                        processing questions, one on one, at our digital
                        infrastructure node.
                      </p>
                    </div>

                    <AnimatePresence>
                      {activeCardPlus === "specialist" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(255, 255, 255, 0.98)",
                            padding: 30,
                            zIndex: 10,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <h4
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              marginBottom: 10,
                            }}
                          >
                            Consultation Portal
                          </h4>
                          <p
                            style={{
                              fontSize: "0.95rem",
                              color: "#6E6E73",
                              lineHeight: 1.5,
                            }}
                          >
                            Our operators handle real-time configuration
                            analysis via the support pipeline to customize blend
                            options exactly according to your environment
                            telemetry data.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px 0",
                        fontSize: "5.5rem",
                      }}
                    >
                      🧑🏽‍💻
                    </div>

                    <div
                      onClick={() =>
                        setActiveCardPlus(
                          activeCardPlus === "specialist" ? null : "specialist"
                        )
                      }
                      style={{
                        position: "absolute",
                        bottom: 24,
                        right: 24,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#1D1D1F",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#FFF",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        zIndex: 11,
                      }}
                    >
                      {activeCardPlus === "specialist" ? "✕" : "+"}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {page === "tea" && (
            <motion.div
              key="tea"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ maxWidth: 650, margin: "0 auto" }}
            >
              <h1
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  marginBottom: 35,
                }}
              >
                Tea System
              </h1>

              <div style={themeCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <h2
                    style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}
                  >
                    🥉 BASIC — “Standard Chai”
                  </h2>
                  <span style={{ fontWeight: 600, color: "#86868B" }}>
                    2 AED
                  </span>
                </div>
                <div
                  style={{
                    color: "#86868B",
                    margin: "16px 0",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  <div>“Simple. Reliable. No questions asked.”</div>
                  <div>“For those who just want tea… not transformation.”</div>
                  <div>“No passes. No pressure. Just chai.”</div>
                </div>
                <motion.button
                  style={themeBtn}
                  onClick={() => addToCart("Basic Tea (Blend 1)")}
                >
                  Add to Queue
                </motion.button>
              </div>

              <div style={themeCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <h2
                    style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}
                  >
                    ⚡ PRO PASS — “ANIKETH ACCESS™”
                  </h2>
                  <span style={{ fontWeight: 600, color: "#86868B" }}>
                    8 AED
                  </span>
                </div>
                <div
                  style={{
                    color: "#86868B",
                    margin: "16px 0",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  <div>“You didn’t buy tea… you unlocked priority.”</div>
                  <div>“Same cup. Different reality.”</div>
                  <div>“Main Character Mode: activated.”</div>
                  <div>“The system recognizes you now.”</div>
                </div>
                <div
                  style={{
                    margin: "12px 0",
                    display: "inline-block",
                    fontSize: "0.85rem",
                    color: "#1D1D1F",
                    fontWeight: 600,
                    background: "#E8E8ED",
                    padding: "6px 14px",
                    borderRadius: 8,
                  }}
                >
                  Express / Premium Holders: 4 AED
                </div>
                <br />
                <motion.button
                  style={themeBtn}
                  onClick={() => addToCart("Pro Tea (Blend 2)")}
                >
                  Add to Queue
                </motion.button>
              </div>

              <div style={themeCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <h2
                    style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}
                  >
                    👑 PREMIUM — “BLACK CARD™”
                  </h2>
                  <span style={{ fontWeight: 600, color: "#1D1D1F" }}>
                    14 AED
                  </span>
                </div>
                <div
                  style={{
                    color: "#86868B",
                    margin: "16px 0",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  <div>“This is no longer tea.”</div>
                  <div>“This is controlled authority in a cup.”</div>
                  <div>“Reserved for those who don’t wait in line.”</div>
                  <div>“You don’t order this. You’re selected for it.”</div>
                </div>
                <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      background: "#E8E8ED",
                      padding: "6px 12px",
                      borderRadius: 6,
                    }}
                  >
                    Express Card: 7 AED
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      background: "#E8E8ED",
                      padding: "6px 12px",
                      borderRadius: 6,
                    }}
                  >
                    Premium Black: 3 AED
                  </span>
                </div>
                <motion.button
                  style={themeBtn}
                  onClick={() => addToCart("Premium Tea (Blend 3)")}
                >
                  Add to Queue
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* --- NEW CHAYA SPECS NAVIGATION PAGE --- */}
          {page === "specs" && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ maxWidth: 720, margin: "0 auto" }}
            >
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  marginBottom: 10,
                }}
              >
                Chaya Specs
              </h1>
              <p
                style={{
                  color: "#86868B",
                  fontSize: "1.15rem",
                  marginBottom: 40,
                }}
              >
                Technical deployment specification logs and metrics
                documentation matrix.
              </p>

              {/* SPEC CARD 1 */}
              <div style={{ ...themeCard, padding: 32, marginBottom: 30 }}>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    marginBottom: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  🧾 BASIC CHAI
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    color: "#86868B",
                    marginBottom: 20,
                  }}
                >
                  Model: CHY-B01 “Standard Brew”
                </div>
                <ul
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: "0 0 24px 0",
                    lineHeight: 1.8,
                    fontSize: "1.05rem",
                  }}
                >
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Taste Profile:</strong> Mild spice blend ·
                    Balanced sweetness
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Energy Output:</strong> 2.1/5 (Stable Focus Mode)
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Service Speed:</strong> 1.2s average dispense time
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Aura Index:</strong> 3/10 (Low visibility state)
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Experience Class:</strong> Everyday Utility Tier
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      color: "#86868B",
                      fontStyle: "italic",
                    }}
                  >
                    <strong>• System Note:</strong> “Reliable baseline beverage
                    protocol”
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  style={themeBtn}
                  onClick={() => setPage("tea")}
                >
                  Configure Blend in Tea System →
                </motion.button>
              </div>

              {/* SPEC CARD 2 */}
              <div style={{ ...themeCard, padding: 32, marginBottom: 30 }}>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    marginBottom: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  ⚡ PRO PASS CHAI
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    color: "#86868B",
                    marginBottom: 20,
                  }}
                >
                  Model: CHY-P02 “Aniketh Access™ Edition”
                </div>
                <ul
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: "0 0 24px 0",
                    lineHeight: 1.8,
                    fontSize: "1.05rem",
                  }}
                >
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Taste Profile:</strong> Enhanced spice matrix ·
                    Depth-boost infusion
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Energy Output:</strong> 3.8/5 (Main Character
                    Activation)
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Service Speed:</strong> Priority pipeline (queue
                    bypass enabled)
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Aura Index:</strong> 7/10 (Social presence
                    amplification)
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Experience Class:</strong> Performance Tier
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      color: "#86868B",
                      fontStyle: "italic",
                    }}
                  >
                    <strong>• System Note:</strong> “User identity uplift
                    detected”
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  style={themeBtn}
                  onClick={() => setPage("tea")}
                >
                  Configure Blend in Tea System →
                </motion.button>
              </div>

              {/* SPEC CARD 3 */}
              <div style={{ ...themeCard, padding: 32, marginBottom: 30 }}>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    marginBottom: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  👑 PREMIUM BLACK CARD CHAI
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    color: "#86868B",
                    marginBottom: 20,
                  }}
                >
                  Model: CHY-X99 “Executive Authority Edition”
                </div>
                <ul
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: "0 0 24px 0",
                    lineHeight: 1.8,
                    fontSize: "1.05rem",
                  }}
                >
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Taste Profile:</strong> Ultra-refined dark roast
                    hybrid
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Energy Output:</strong> 5/5 (Controlled dominance
                    state)
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Service Speed:</strong> Instant execution protocol
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Aura Index:</strong> 10/10 (Room influence
                    detected)
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <strong>• Experience Class:</strong> Elite Access Tier
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      color: "#86868B",
                      fontStyle: "italic",
                    }}
                  >
                    <strong>• System Note:</strong> “Subject classified as
                    high-priority entity”
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  style={themeBtn}
                  onClick={() => setPage("tea")}
                >
                  Configure Blend in Tea System →
                </motion.button>
              </div>
            </motion.div>
          )}

          {page === "beans" && (
            <motion.div
              key="beans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  marginBottom: 6,
                }}
              >
                🌿 COFFEE / BEANS SECTION
              </h1>
              <p
                style={{
                  color: "#86868B",
                  fontSize: "1.15rem",
                  marginBottom: 40,
                }}
              >
                Every option is processed dynamically through web-checkout
                protocols.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 24,
                }}
              >
                {beans.map((bean, i) => (
                  <motion.div key={i} whileHover={{ y: -4 }} style={themeCard}>
                    <h3
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "1.3rem",
                        fontWeight: 600,
                      }}
                    >
                      {bean.title}
                    </h3>
                    <div
                      style={{
                        color: "#86868B",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        marginBottom: 20,
                        fontStyle: "italic",
                      }}
                    >
                      {bean.lines.map((ln, idx) => (
                        <div key={idx}>{ln}</div>
                      ))}
                    </div>
                    <motion.button
                      style={themeBtn}
                      onClick={() =>
                        addToCart(
                          `Coffee Parameter: C${i + 1} (${
                            bean.title.split(" ")[1]
                          })`
                        )
                      }
                    >
                      Add to Queue
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {page === "premium" && (
            <motion.div
              key="premium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ maxWidth: 600, margin: "0 auto" }}
            >
              <div
                style={{
                  textTransform: "uppercase",
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                <span
                  style={{
                    color: "#FF9500",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                  }}
                ></span>
                <h1
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    color: "#FFF",
                    marginTop: 10,
                    textTransform: "none",
                  }}
                >
                  PREMIUM LOUNGE
                </h1>
              </div>

              <motion.div whileHover={{ y: -2 }} style={cardDark}>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    color: "#FFF",
                    fontSize: "1.4rem",
                  }}
                >
                  Access Pass Registry
                </h3>
                <p
                  style={{
                    color: "#86868B",
                    fontSize: "0.95rem",
                    marginBottom: 20,
                  }}
                >
                  Initialize configuration alignment parameters instantly via
                  our primary community network.
                </p>
                <motion.button
                  style={{ ...btnDark, background: "#FF9500", color: "#FFF" }}
                  onClick={() => window.open(DISCORD_LINK, "_blank")}
                >
                  Apply for Pass Now 🚀
                </motion.button>
              </motion.div>

              <div style={cardDark}>
                <h2
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "1.8rem",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  Expect a callback
                </h2>
                <p
                  style={{
                    color: "#86868B",
                    margin: "0 0 20px 0",
                    fontSize: "1rem",
                  }}
                >
                  Lounge processing triggers automatically if telemetry aura is
                  verified.
                </p>

                <form
                  onSubmit={handleCallbackSubmit}
                  style={{ borderTop: "1px solid #333336", paddingTop: 20 }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      color: "#A1A1AA",
                    }}
                  >
                    Secure Phone Node Address:
                  </label>
                  <input
                    type="tel"
                    placeholder="+971 XX XXX XXXX"
                    required
                    style={inputDark}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <motion.button
                    type="submit"
                    style={{ ...btnDark, marginTop: 16 }}
                  >
                    Request Registry Injection
                  </motion.button>
                </form>

                {callbackStatus && (
                  <div
                    style={{ marginTop: 16, color: "#30D158", fontWeight: 600 }}
                  >
                    {callbackStatus}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {page === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ maxWidth: 600, margin: "0 auto" }}
            >
              <h1
                style={{
                  fontSize: "2.5rem",
                  marginTop: 30,
                  marginBottom: 10,
                  fontWeight: 700,
                }}
              >
                Your Checkout Queue
              </h1>
              <p style={{ color: "#86868B", marginBottom: 35 }}>
                Compile and review multiple items collectively before system
                hand-off.
              </p>

              {cart.length === 0 ? (
                <div style={themeCard}>
                  <p style={{ color: "#86868B", margin: 0 }}>
                    Your batch queue is empty.
                  </p>
                  <motion.button
                    style={{ ...themeBtn, marginTop: 20 }}
                    onClick={() => setPage("home")}
                  >
                    Browse Menu Matrix
                  </motion.button>
                </div>
              ) : (
                <div>
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        ...themeCard,
                        padding: "18px 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                        {item}
                      </span>
                      <button
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#FF453A",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                        onClick={() => removeFromCart(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <div
                    style={{
                      ...themeCard,
                      background: "rgba(0, 113, 227, 0.03)",
                      border: "1px dashed #0071E3",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "1.15rem",
                        color: "#0071E3",
                      }}
                    >
                      🎬 Attached Video Payload Evidence
                    </h3>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      style={{ fontSize: "0.9rem" }}
                    />
                    {uploadedVideo && (
                      <div style={{ marginTop: 15 }}>
                        <video
                          src={uploadedVideo}
                          controls
                          style={{
                            width: "100%",
                            borderRadius: 12,
                            background: "#000",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      ...themeCard,
                      border: "1px dashed #FF453A",
                      background: "rgba(255,69,58,0.03)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontWeight: 600,
                        color: "#FF453A",
                      }}
                    >
                      ⚠️ Take a screenshot of this setup summary to provide
                      alongside file logs.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 16 }}>
                    <motion.button
                      style={{
                        ...themeBtnSec,
                        background: "rgba(255,69,58,0.08)",
                        color: "#FF453A",
                        width: "35%",
                      }}
                      onClick={() => {
                        setCart([]);
                        setUploadedVideo(null);
                      }}
                    >
                      Reset Queue
                    </motion.button>
                    <motion.button
                      style={{
                        ...themeBtn,
                        background: "#5865F2",
                        color: "#fff",
                        width: "65%",
                      }}
                      onClick={() => (window.location.href = DISCORD_LINK)}
                    >
                      Submit Ticket Pipeline 💳
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {page === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ maxWidth: 600, margin: "0 auto" }}
            >
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                About Ani-Corp
              </h1>
              <p
                style={{
                  color: "#86868B",
                  fontSize: "1.1rem",
                  marginBottom: 30,
                }}
              >
                A lifestyle upgrade ecosystem designed in CUPERTINO 🌴
              </p>

              {/* Premium Scroll-Interactive Movie Trigger Card Component */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                style={{
                  ...themeCard,
                  background: "linear-gradient(145deg, #111112, #000000)",
                  color: "#FFF",
                  border: "1px solid #222225",
                  padding: "40px 30px",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "#FFF",
                  }}
                >
                  The Core Experience
                </h3>
                <p
                  style={{
                    color: "#86868B",
                    fontSize: "0.95rem",
                    marginBottom: 25,
                    maxWidth: 400,
                    margin: "0 auto 24px",
                  }}
                >
                  Immerse yourself in our architectural overview video
                  controlled completely by your scrolling pacing velocity.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...btnLight,
                    background: "#FFF",
                    color: "#000",
                    fontWeight: "600",
                  }}
                  onClick={() => setIsTrailerActive(true)}
                >
                  ▶ Watch Trailer (Scroll Controlled)
                </motion.button>
              </motion.div>

              <div style={themeCard}>
                <h4
                  style={{
                    margin: "0 0 6px 0",
                    color: "#86868B",
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                  }}
                >
                  Core Mandate
                </h4>
                <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 500 }}>
                  Restructure comprehensive global tea frameworks.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <footer
        style={{
          textAlign: "center",
          paddingBottom: 40,
          color: "#86868B",
          fontSize: "0.9rem",
        }}
      >
        Ani-Corp of إمارات
      </footer>
    </div>
  );
}
