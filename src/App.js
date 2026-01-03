import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import logo from './Logo.png';
import newPro from './new_pro.jpeg';
import resume from './resume.pdf';
import { init, sendForm } from '@emailjs/browser';

/* eslint-disable jsx-a11y/anchor-is-valid */

function App() {
  // Initialize EmailJS (set REACT_APP_EMAILJS_PUBLIC_KEY in your .env)
  try {
    if (process.env.REACT_APP_EMAILJS_PUBLIC_KEY) init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
  } catch (e) {
    // ignore during server-side/static analysis
  }
  useEffect(() => {
    const pageTurnBtn = document.querySelectorAll('.nextprev-btn');
    const pages = document.querySelectorAll('.book-page.page-right');
    const contactMeBtn = document.querySelector('.btn.contact-me');
    const backProfileBtn = document.querySelector('.back-profile');
    const coverRight = document.querySelector('.cover.cover-right');

    if (!pages) return;

    pageTurnBtn.forEach((el, index) => {
      el.onclick = () => {
        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);
        if (!pageTurn) return;

        if (pageTurn.classList.contains('turn')) {
          pageTurn.classList.remove('turn');
          setTimeout(() => {
            pageTurn.style.zIndex = 2 - index;
          }, 500);
        } else {
          pageTurn.classList.add('turn');
          setTimeout(() => {
            pageTurn.style.zIndex = 2 + index;
          }, 500);
        }
      };
    });

    const contactHandler = () => {
      pages.forEach((page, index) => {
        setTimeout(() => {
          page.classList.add('turn');
          setTimeout(() => {
            page.style.zIndex = 20 + index;
          }, 500);
        }, (index + 1) * 200 + 100);
      });
    };
    contactMeBtn?.addEventListener('click', contactHandler);

    let totalPages = pages.length;
    let pageNumber = 0;

    function reverseIndex() {
      pageNumber--;
      if (pageNumber < 0) {
        pageNumber = totalPages - 1;
      }
    }

    const backHandler = () => {
      pages.forEach((_, index) => {
        setTimeout(() => {
          reverseIndex();
          pages[pageNumber].classList.remove('turn');
          setTimeout(() => {
            reverseIndex();
            pages[pageNumber].style.zIndex = 10 + index;
          }, 500);
        }, (index + 1) * 200 + 100);
      });
    };
    backProfileBtn?.addEventListener('click', backHandler);

    // opening animation
    setTimeout(() => {
      coverRight?.classList.add('turn');
    }, 2100);

    setTimeout(() => {
      if (coverRight) coverRight.style.zIndex = '-1';
    }, 2800);

    pages.forEach((_, index) => {
      setTimeout(() => {
        reverseIndex();
        pages[pageNumber].classList.remove('turn');
        setTimeout(() => {
          reverseIndex();
          pages[pageNumber].style.zIndex = 10 + index;
        }, 500);
      }, (index + 1) * 200 + 2100);
    });

    // Keyboard navigation: initialize ref based on already-turned pages
    keyboardIndexRef.current = Array.from(pages).filter((p) => p.classList.contains('turn')).length;

    const handleKey = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goForwardRef();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goBackRef();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      contactMeBtn?.removeEventListener('click', contactHandler);
      backProfileBtn?.removeEventListener('click', backHandler);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  // navigation functions accessible from JSX — use refs to keep index across renders
  const keyboardIndexRef = useRef(0);
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || undefined;
    if (!formRef.current) return;
    setSending(true);
    sendForm(serviceId, templateId, formRef.current, publicKey)
      .then(() => {
        setSending(false);
        // simple feedback — replace with nicer UI if desired
        // eslint-disable-next-line no-alert
        alert('Message sent — thanks!');
        formRef.current.reset();
      })
      .catch((err) => {
        setSending(false);
        // eslint-disable-next-line no-console
        console.error('EmailJS send error', err);
        // eslint-disable-next-line no-alert
        alert('Failed to send message — try again later.');
      });
  };
  const goForwardRef = () => {
    const pages = document.querySelectorAll('.book-page.page-right');
    const total = pages.length;
    let idx = keyboardIndexRef.current;
    if (idx >= total) return;
    pages[idx].classList.add('turn');
    setTimeout(() => {
      pages[idx].style.zIndex = 20 + idx;
    }, 500);
    keyboardIndexRef.current = idx + 1;
  };
  const goBackRef = () => {
    const pages = document.querySelectorAll('.book-page.page-right');
    let idx = keyboardIndexRef.current;
    if (idx <= 0) return;
    idx = idx - 1;
    pages[idx].classList.remove('turn');
    setTimeout(() => {
      pages[idx].style.zIndex = 10 + idx;
    }, 500);
    keyboardIndexRef.current = idx;
  };

  return (
    <div className="App">
      <button className="nav-btn nav-left" onClick={() => goBackRef()} aria-label="Previous page">‹</button>
      <button className="nav-btn nav-right" onClick={() => goForwardRef()} aria-label="Next page">›</button>
      <div className="wrapper">
        <div className="cover cover-left" />
        <div className="cover cover-right" />

        <div className="book">
          <div className="book-page page-left">
            <div className="profile-page">
              <img src={logo} alt="Logo" />
              <h1>Srujan K</h1>
              <h3>Software Engineer</h3>

              <div className="social-media">
                <a href="https://github.com/srujangowda756" target="_blank" rel="noreferrer">
                  <i className="bx bxl-github" />
                </a>
                <a href="https://x.com/SrujanG4251082849" target="_blank" >
                  <i className="bx bxl-twitter" />
                </a>
                <a href="https://vercel.com/srujans-projects-aa7b6570" target="_blank" rel="noreferrer" aria-label="Vercel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2L2 22h20L12 2z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/srujan756/" target="_blank" >
                  <i className="bx bxl-linkedin-square" />
                </a>
              </div>

              <p>
                Hi, Software Engineer with hands-on experience in AI,ML,full-stack development and App Development, delivering scalable, production-ready applications.
              </p>

              <div className="btn-box">
                <a href={resume} className="btn" download>
                  Download CV
                </a>
                <a href="#" className="btn contact-me">
                  Contact Me!
                </a>
              </div>
            </div>
          </div>

          <div className="book-page page-right turn" id="turn-1">
            <div className="page-front">
              <h1 className="title">Work Experience</h1>

              <div className="workeduc-box">
                <div className="workeduc-content">
                  <span className="year">
                    <i className="bx bxs-calendar" />July-2025 - Sep-2025
                  </span>
                  <h3>Web Developer Intern - Cloudision</h3>
                  <p>
                   where I contributed to building and maintaining web applications, enhancing user interfaces, and collaborating with the development team to deliver high-quality solutions.
                  </p>
                </div>

                <div className="workeduc-content">
                  <span className="year">
                    <i className="bx bxs-calendar" />Dec-2025 - Jun-2026
                  </span>
                  <h3>Full stack development - Heartiest Mind Technologies</h3>
                  <p>
                    As a Full Stack Developer at Heartiest Mind Technologies, I was responsible for designing, developing, and maintaining web applications that met the needs of our diverse clientele.
                  </p>
                </div>

                <div className="workeduc-content">
                  <span className="year">
                    <i className="bx bxs-calendar" />2025
                  </span>
                  <h3>Android App Developer - MindMatrix</h3>
                  <p>
                    I was involved in creating user-friendly and efficient mobile applications for the Android platform.
                  </p>
                </div>
              </div>
              <span className="number-page">1</span>

              <span className="nextprev-btn" data-page="turn-1" aria-label="Next page">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <div className="page-back">
              <h1 className="title">Education</h1>

                          <div className="workeduc-box">
                            <div className="workeduc-content">
                              <span className="year">
                                <i className="bx bxs-calendar" />2022 - 2026
                              </span>
                              <h3>BE in CSE</h3>
                              <p>
                                I completed my Bachelor of Engineering in Computer Science and Engineering from East west college of engineering, Bangalore with CGPA 8.5
                              </p>
                            </div>

                            <div className="workeduc-content">
                              <span className="year">
                                <i className="bx bxs-calendar" />2020 - 2022
                              </span>
                              <h3>PUC</h3>
                              <p>
                                I completed my PUC from Government college, Honnavalli, in PCMB stream with 82% 
                              </p>
                            </div>

                            <div className="workeduc-content">
                              <span className="year">
                                <i className="bx bxs-calendar" />2020
                              </span>
                              <h3>10th</h3>
                              <p>
                                I completed my SSLC from Morarji Desai Residential School, Rangapura Kaval with 88.48%
                              </p>
                            </div>
                          </div>

                          <span className="number-page">2</span>
                          <span className="nextprev-btn back" data-page="turn-1" aria-label="Previous page">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="book-page page-right turn" id="turn-2">
                        <div className="page-front">
                          <h1 className="title">My Projects</h1>

                          <div className="services-box">
                            <div className="services-content">
                              <h3>AI based Traffic Managament</h3>
                              <p>
                                That utilizes computer vision and machine learning algorithms to optimize traffic flow, reduces congestion in urban areas.
                              </p>
                              <a href="https://github.com/srujangowda756/Traffic-Management" className="btn">
                                Read More
                              </a>
                            </div>

                            <div className="services-content">
                              <h3>Doc To Excel Automation</h3>
                              <p>
                                That automates the extraction of tabular data from Word documents and converts it into structured Excel spreadsheets.
                              </p>  
                              <a href="https://github.com/srujangowda756/python-doc-to-excel-automaton" className="btn">
                                Read More
                              </a>
                            </div>

                            <div className="services-content">
                              <h3>Job Portal</h3>
                              <p>
                                (username:rahul password:rahul@2021) A web application that facilitates job seekers in finding employment opportunities.
                              </p>
                              <a href="https://job-portal-one-pearl.vercel.app" className="btn">
                                Live On
                              </a>
                            </div>

                            <div className="services-content">
                              <h3>Brand Ai</h3>
                              <p>
                                An AI-powered platform that helps businesses create and manage their brand identity effectively for better market presence.
                              </p>
                              <a href="https://brand-vision-ai-ruddy.vercel.app" className="btn">
                                Live On
                              </a>
                            </div>
                          </div>

                          <span className="number-page">3</span>

                          <span className="nextprev-btn" data-page="turn-2" aria-label="Next page">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>

                        <div className="page-back">
                          <h1 className="title">My Skills</h1>

                          <div className="skills-box">
                            <div className="skills-content">
                              <h3>Front-End</h3>
                              <div className="content">
                                <span>
                                  <i className="bx bxl-html5" /> HTML
                                </span>
                                <span>
                                  <i className="bx bxl-css3" />CSS
                                </span>
                                <span>
                                  <i className="bx bxl-javascript" />JS
                                </span>
                                <span>
                                  <i className="bx bxl-react" />React Js
                                </span>
                                <span>
                                  <i className="bx bxl-bootstrap" />BootStrap
                                </span>
                                <span>
                                  <i className="bx bxl-tailwind-css"/>Tailwind
                                </span>
                              </div>
                            </div>

                            <div className="skills-content">
                              <h3>Back-End</h3>
                              <div className="content">
                                <span>
                                  <i className="bx bxl-python" />Python
                                </span>
                                <span>
                                  <i className="bx bxl-java" />Java
                                </span>
                                <span>
                                  <i className="bx bxl-nodejs" />Node JS
                                </span>
                                <span>
                                  <i className="bx bxl" />C++
                                </span>
                              </div>
                            </div>

                            <div className="skills-content">
                              <h3>Database</h3>
                              <div className="content">
                                <span>
                                  <i className="bx bxl-data" />Sql
                                </span>
                                <span>
                                  <i className="bx bxl-mangodb" />mangoDB
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="number-page">4</span>

                          <span className="nextprev-btn back" data-page="turn-2" aria-label="Previous page">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="book-page page-right turn" id="turn-3">
                        <div className="page-front">
                          <h1 className="title">Latest Project</h1>

                          <div className="portfolio-box">
                            <div className="img-box">
                              <img src={newPro} alt="Project preview" />
                            </div>

                            <div className="info-box">
                              <div className="info-title">
                                <h3>AR and AI in higher eduaction</h3>

                              </div>
                              <p>Tech Used:</p>
                              <p>
                                React js,Node js,Express js,Python, Tensorflow, OpenCV, ML, NLP, Generative AI and LLMs
                              </p>
                            </div>
                            <div className="btn-box">
                              <a href="https://github.com/srujangowda756/ai-in-higher-education" className="btn">
                                Source Code
                              </a>
                              <a href="https://github.com/srujangowda756" className="btn">
                                More Projects
                              </a>
                            </div>
                          </div>

                          <span className="number-page">5</span>

                          <span className="nextprev-btn" data-page="turn-3" aria-label="Next page">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>

                        <div className="page-back">
                          <h1 className="title">Contact Me!</h1>

                          <div className="contact-box">
                            <form ref={formRef} onSubmit={handleContactSubmit}>
                              <input name="user_name" type="text" className="field" placeholder="Full Name" required />
                              <input name="user_email" type="email" className="field" placeholder="Email Address" required />
                              <textarea name="message" cols="30" rows="10" className="field" placeholder="Your Message" required />
                              <input type="submit" value={sending ? 'Sending...' : 'Send Message'} className="btn" disabled={sending} />
                            </form>
                          </div>

                          <span className="number-page">6</span>
                          <span className="nextprev-btn back" data-page="turn-3" aria-label="Previous page">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>

                          <a href="#" className="back-profile">
                            <p>Profile</p>
                            <i className="bx bxs-user" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

  export default App
