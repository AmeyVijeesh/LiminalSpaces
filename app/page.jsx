'use client';

import React, { useEffect, useRef, useState } from 'react';
import '@/styles/home.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const quotes = [
  "They remember you. Even though you've never been here.",
  'It’s not the emptiness that hurts — it’s the feeling that something used to be here.',
  'It feels like coming home to a place that never existed.',
  'It’s always 10:35 here. Always.',
];

const Home = () => {
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const slowSectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({ smooth: true, lerp: 0.1 });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const video = videoRef.current;
    video.pause();

    const updateVideo = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScroll;

      const duration = video.duration || 1;
      video.currentTime = scrollFraction * duration;
    };

    // Random glitch effect trigger
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, Math.random() * 5000 + 3000);

    const animate = () => {
      updateVideo();

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const slowSection = slowSectionRef.current;
      const slowTop = slowSection.offsetTop;
      const slowBottom = slowTop + slowSection.offsetHeight;

      // If scroll is within the slow section
      if (scrollTop + windowHeight > slowTop && scrollTop < slowBottom) {
        lenis.options.lerp = 0.03; // slow scroll
      } else {
        lenis.options.lerp = 0.1; // normal scroll
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    gsap.registerPlugin(ScrollTrigger);

    const photos = gsap.utils.toArray('.liminal-photo');

    photos.forEach((photo) => {
      gsap.fromTo(
        photo,
        { opacity: 0, filter: 'blur(10px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: photo,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    animate();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      clearInterval(glitchInterval);
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <video ref={videoRef} className="videoo">
        <source src="/output1.mp4" type="video/mp4" />
      </video>

      {/* Noise overlay */}
      <div className="noise-overlay"></div>

      <div
        className="scrollContent"
        style={{ height: '8000vh', position: 'relative', zIndex: 1 }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src="/backrooms.jpeg"
            alt=""
            style={{ height: '100vh', width: '100%', objectFit: 'cover' }}
          />
          <div className={`hero-text ${glitchActive ? 'glitch' : ''}`}>
            <h1 className="liminal-title">LIMINAL SPACES</h1>
            <p className="liminal-subtitle">A Small Webpage by Amey.</p>
          </div>
        </div>
        <section
          style={{ backgroundColor: 'transparent', height: '400vh' }}
        ></section>
        <section ref={slowSectionRef} className="liminal-text-section">
          <div
            className={`text-container ${glitchActive ? 'text-glitch' : ''}`}
          >
            <h1 className="liminal-heading">Neither here, nor there.</h1>
            <p className="liminal-paragraph">
              Liminal spaces are the transitory places we often pass through,
              including stairwells, doorways, school hallways at night, empty
              malls. Yet, unlike normal spaces, they invoke a strong sense of
              emotion within oneself. They exist on the edge of familiarity and
              dreams, evoking feelings of nostalgia, unease, and stillness.{' '}
              <br /> <br />
              The word liminal comes from the Latin limen, meaning "threshold."
              These spaces are thresholds, not quite one place or another, but
              somewhere in between. They often appear empty or abandoned, yet
              strangely familiar, as if you’ve seen them in a dream or memory.
            </p>
          </div>
        </section>
        <section className="floating-text-section">
          <h2 className="floating-text">
            Many pass through, but few truly see it..
          </h2>
        </section>
        <section style={{ height: '100vh' }}></section>
        <section ref={slowSectionRef} className="liminal-text-section">
          <div
            className={`text-container ${glitchActive ? 'text-glitch' : ''}`}
          >
            <h1 className="liminal-heading">Surreality. Fear. Unease.</h1>
            <p className="liminal-paragraph">
              Liminality isn't always obvious, it is a feeling that creeps in
              quietly. It is the echo of forgotten places, the eerie stillness
              of a memory you can't quite place. It stirs something deep: old
              forgotten dreams, distant childhood moments, emotions without
              names. Not everyone notices it. But once you do, it stays with
              you.
              <br /> <br /> Liminal spaces feel off because they are in-between
              places. They aren’t meant to be destinations — just paths. But
              when they’re empty or frozen in time, your brain doesn’t know how
              to process them. That’s where the unease, nostalgia, and surreal
              feeling comes from.
            </p>
          </div>
        </section>
        <section style={{ height: '300vh' }}></section>
        <section
          ref={slowSectionRef}
          className="liminal-text-section"
          style={{ height: '200vh' }}
        >
          <div
            className={`text-container ${glitchActive ? 'text-glitch' : ''}`}
          >
            <h1 className="liminal-heading">Think about it...</h1>
            <p className="liminal-paragraph">
              Imagine standing in your childhood nursery. You remember it all:
              the laughter, the chaos, the voices of children and teachers
              echoing through the air. It was alive, bursting with noise and
              movement. Now, imagine walking back in — years later. The
              classroom is abandoned, dark, silent. Frozen in time. The things
              are still there, but the souls are gone. The voices are gone.
              Everything has moved on — the sounds, the people, the energy.
              What’s left is a shell. Familiar, but hollow.
              <br /> <br /> That quiet unease you feel? That’s liminality.
            </p>{' '}
          </div>
        </section>
        <section style={{ height: '350vh' }}></section>
        <section>
          {' '}
          <img src="pic4.webp" alt="" className="liminal-photo" />
          <img src="pic2.jpg" alt="" className="liminal-photo" />
          <img src="pic3.webp" alt="" className="liminal-photo" />
          <img src="pic5.webp" alt="" className="liminal-photo" />
        </section>
        <section style={{ height: '300vh' }}></section>
        <section
          ref={slowSectionRef}
          className="liminal-text-section"
          style={{ height: '200vh' }}
        >
          <div
            className={`text-container ${glitchActive ? 'text-glitch' : ''}`}
          >
            <h1 className="liminal-heading">Liminal Comfort...?</h1>
            <p className="liminal-paragraph">
              Not everyone fears liminal spaces. For some, these quiet,
              in-between places are a form of sanctuary. They find comfort in
              the stillness, in the soft hum of fluorescent lights, in the
              untouched dust of an empty hallway, in the silence of a room long
              forgotten. These spaces do not demand, they do not rush. They
              simply exist.
              <br />
              <br />
              Here, time doesn’t push you forward. Expectations fade. You are no
              one and nowhere here. For those who find the world too loud, too
              sharp, too real...liminal places offer a pause. A breath between
              chapters. A place to disappear, gently.
              <br />
              <br />
              It's not about being lost. It's about being free, in the briefest
              of moments, from everything else.
            </p>{' '}
          </div>
        </section>
        <section style={{ height: '150vh' }}></section>
        {quotes.map((quote) => {
          return (
            <section
              ref={slowSectionRef}
              className="floating-text-section"
              key={quote}
            >
              <h2 className="floating-text">{quote}</h2>
            </section>
          );
        })}{' '}
        <section style={{ height: '600vh' }}></section>
        <section
          style={{
            height: '1200vh',
            position: 'relative',
            border: '10px dotted pink',
          }}
        >
          <div className="end-image-wrapper" ref={imageWrapperRef}>
            <div className="end-image-row">
              <img
                src="https://i.ytimg.com/vi/fiO69UzTWxg/maxresdefault.jpg"
                alt=""
                className="liminal-end-img"
              />
            </div>
            <div className="end-image-row">
              {' '}
              <img
                src="https://preview.redd.it/took-this-pic-yesterday-and-thought-it-was-kinda-liminal-v0-w1el4015e1ye1.jpeg?width=1080&crop=smart&auto=webp&s=4de818e8a91c4b22dbbe238f94934469d9809a18"
                alt=""
                className="liminal-end-img"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
