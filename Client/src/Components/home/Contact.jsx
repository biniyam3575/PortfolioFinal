import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RiMailSendLine, RiPhoneLine, RiMapPinLine, RiTelegramLine, 
  RiGithubLine, RiLinkedinLine, RiSendPlaneFill,
  RiLoader4Line, RiCheckboxCircleLine, RiErrorWarningLine
} from 'react-icons/ri';

const Contact = () => {
  const [status, setStatus] = useState("IDLE");

  const serviceTags = ["Full-stack Development", "API Architecture", "UI/UX Optimization", "React Specialist"];

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setStatus("SENDING");
    const formData = new FormData(event.target);
    formData.append("access_key", "b625681e-e16d-4928-a258-717a06c8a274");
    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const data = await response.json();
      if (data.success) {
        setStatus("SUCCESS");
        event.target.reset();
        setTimeout(() => setStatus("IDLE"), 5000);
      } else {
        setStatus("ERROR");
        setTimeout(() => setStatus("IDLE"), 4000);
      }
    } catch {
      setStatus("ERROR");
      setTimeout(() => setStatus("IDLE"), 4000);
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen 
        bg-white dark:bg-black 
        py-16 px-10 md:px-24 
        border-t border-black/5 dark:border-white/5
        transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* HEADER */}
        <div className="text-left mb-16">
          <p className="text-[#822cff] font-mono text-[10px] tracking-[0.6em] uppercase mb-2 font-bold flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#822cff]"></span> Connection
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
            Start a <span className="text-gray-400 italic font-light">Conversation.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT COLUMN */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-black dark:text-white text-2xl font-bold tracking-tight">Contact Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-200 max-w-sm leading-relaxed">
                Currently available for selected freelance opportunities and architectural consultations.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {serviceTags.map((tag, idx) => (
                  <span key={idx} className="text-[9px] font-mono border border-[#822cff] text-[#822cff] px-3 py-1 rounded-full uppercase tracking-widest bg-[#822cff]/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* DIRECT LINKS */}
            <div className="space-y-4">
              <a href="mailto:biniyam1177@gmail.com" className="flex items-center gap-4 text-black dark:text-white hover:text-[#822cff] dark:hover:text-[#822cff] transition-all group">
                <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/20 flex items-center justify-center rounded-lg group-hover:border-[#822cff] transition-colors">
                  <RiMailSendLine size={20} />
                </div>
                <span className="text-sm font-semibold tracking-wide">biniyam1177@gmail.com</span>
              </a>
              <a href="tel:+251935754261" className="flex items-center gap-4 text-black dark:text-white hover:text-[#822cff] dark:hover:text-[#822cff] transition-all group">
                <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/20 flex items-center justify-center rounded-lg group-hover:border-[#822cff] transition-colors">
                  <RiPhoneLine size={20} />
                </div>
                <span className="text-sm font-semibold tracking-wide">+251 935 754 261</span>
              </a>
              <div className="flex items-center gap-4 text-black dark:text-white">
                <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/20 flex items-center justify-center rounded-lg">
                  <RiMapPinLine size={20} />
                </div>
                <span className="text-sm font-semibold tracking-wide">Addis Ababa, Ethiopia</span>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="flex gap-4 pt-2">
              {[
                { href: "https://github.com/biniyam3575", icon: <RiGithubLine /> },
                { href: "https://www.linkedin.com/in/biniyam-beyene-7820b2358/", icon: <RiLinkedinLine /> },
                { href: "https://t.me/Bini1177", icon: <RiTelegramLine /> },
              ].map(({ href, icon }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  className="w-12 h-12 bg-gray-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/20 
                    flex items-center justify-center text-xl 
                    text-black dark:text-white 
                    hover:bg-[#822cff] hover:text-white hover:border-[#822cff]
                    transition-all rounded-xl"
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* MAP */}
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 grayscale brightness-[0.9] dark:brightness-[0.6] hover:grayscale-0 hover:brightness-100 transition-all duration-1000">
              <iframe 
                title="Addis Ababa Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126115.1152771578!2d38.744470!3d9.010793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24c49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1712345678901"
                width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen="" loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="bg-gray-50 dark:bg-[#070707] border border-black/10 dark:border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#822cff]/10 dark:bg-[#822cff]/15 blur-3xl rounded-full -z-10"></div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-black dark:text-white font-black ml-1">Full Name</label>
                  <input 
                    required name="name" type="text" placeholder="Enter your name"
                    className="w-full bg-white dark:bg-black border-2 border-black/10 dark:border-white/20 rounded-xl px-4 py-4 
                      text-black dark:text-white text-sm 
                      focus:border-[#822cff] focus:ring-1 focus:ring-[#822cff] 
                      outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-black dark:text-white font-black ml-1">Email Address</label>
                  <input 
                    required name="email" type="email" placeholder="example@gmail.com"
                    className="w-full bg-white dark:bg-black border-2 border-black/10 dark:border-white/20 rounded-xl px-4 py-4 
                      text-black dark:text-white text-sm 
                      focus:border-[#822cff] focus:ring-1 focus:ring-[#822cff] 
                      outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-black dark:text-white font-black ml-1">Message</label>
                <textarea 
                  required name="message" rows="5" placeholder="Tell me about your project..."
                  className="w-full bg-white dark:bg-black border-2 border-black/10 dark:border-white/20 rounded-xl px-4 py-4 
                    text-black dark:text-white text-sm 
                    focus:border-[#822cff] focus:ring-1 focus:ring-[#822cff] 
                    outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                ></textarea>
              </div>

              <button 
                type="submit" disabled={status === "SENDING"}
                className={`w-full font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-500 group border-2 ${
                  status === "SUCCESS" 
                    ? "bg-green-500 border-green-500 text-white" 
                    : status === "ERROR"
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-black text-white border-transparent dark:bg-white dark:text-black hover:bg-[#822cff] hover:text-white hover:border-[#822cff]"
                }`}
              >
                {status === "IDLE" && (<>TRANSMIT MESSAGE <RiSendPlaneFill className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>)}
                {status === "SENDING" && (<><RiLoader4Line className="animate-spin text-xl" /> ENCRYPTING...</>)}
                {status === "SUCCESS" && (<><RiCheckboxCircleLine className="text-xl" /> SENT SUCCESSFULLY</>)}
                {status === "ERROR" && (<><RiErrorWarningLine className="text-xl" /> SUBMISSION FAILED</>)}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;