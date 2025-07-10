'use client';

import React, { useEffect, useRef, useState } from 'react';
import '@/styles/home.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Progressbar from '@/components/Progressbar';
import AnimatedCursor from 'react-animated-cursor';
import Loader from '@/components/Loader';

const quotes = [
  "They remember you. Even though you've never been here.",
  "It's not the emptiness that hurts — it's the feeling that something used to be here.",
  'It feels like coming home to a place that never existed.',
  "It's always 10:35 here. Always.",
];

const dreamNotes = [
  {
    position: 'left',
    title: 'Memory Fragment',
    content:
      'The shouts and laughters of happy children has dissolved, only to be replaced by the echoes of lost memories.',
    date: 'Lost Memories',
  },
  {
    position: 'right',
    title: 'Lost Emotions',
    content:
      'Abandoned, empty spaces hold more memories and emotion than most people ever could.',
    date: 'Unknown',
  },
  {
    position: 'left',
    title: 'Silent Scream',
    content: 'The silence is louder than the voices beyond the walls.',
    date: 'The Lost Traveller',
  },
  {
    position: 'right',
    title: 'Reality Distortion',
    content: 'Reality gets thin around edges of dreams like this...',
    date: 'Unknown',
  },
  {
    position: 'left',
    title: 'Familiar Dreams',
    content: "You've been here before. But this place has never existed...",
    date: 'Forgotten Dreams',
  },
];

const Home = () => {
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const slowSectionRef = useRef(null);
  const dreamSectionRef = useRef(null);
  const finalSectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showText, setShowText] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFullyLoaded, setVideoFullyLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState('Initializing...');

  useEffect(() => {
    const video = videoRef.current;

    const handleVideoProgress = (e) => {
      if (video) {
        try {
          const buffered = video.buffered;
          if (buffered.length > 0) {
            const loadedEnd = buffered.end(buffered.length - 1);
            const total = video.duration || 1; // Prevent division by zero
            const percentLoaded = Math.min(
              Math.round((loadedEnd / total) * 100),
              100
            );

            setLoadingProgress(percentLoaded);

            if (percentLoaded === 100) {
              setVideoLoaded(true);
            }
          }
        } catch (error) {
          console.error('Video progress tracking error:', error);
        }
      }
    };

    const handleVideoLoaded = () => {
      setVideoLoaded(true);
      setLoadingProgress(100);
    };

    const handleVideoError = (error) => {
      console.error('Video loading error:', error);
      setTimeout(() => {
        setLoading(false);
        setShowText(true);
      }, 10000);
    };

    if (video) {
      video.addEventListener('progress', handleVideoProgress);
      video.addEventListener('loadedmetadata', handleVideoLoaded);
      video.addEventListener('canplaythrough', handleVideoLoaded);
      video.addEventListener('error', handleVideoError);

      if (video.readyState >= 2) {
        setVideoLoaded(true);
        setLoadingProgress(100);
      }
    }

    const loadingTimeout = setTimeout(() => {
      if (!videoLoaded) {
        console.warn('Video loading timed out');
        setLoading(false);
        setShowText(true);
      }
    }, 10000);

    return () => {
      if (video) {
        video.removeEventListener('progress', handleVideoProgress);
        video.removeEventListener('loadedmetadata', handleVideoLoaded);
        video.removeEventListener('canplaythrough', handleVideoLoaded);
        video.removeEventListener('error', handleVideoError);
      }
      clearTimeout(loadingTimeout);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force aggressive loading
    video.preload = 'auto';
    video.load();

    const updateLoadingProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration || 1;
        const progress = Math.min((bufferedEnd / duration) * 100, 100);

        setLoadingProgress(progress);

        // Update loading phase messages
        if (progress < 25) {
          setLoadingPhase('Loading video...');
        } else if (progress < 50) {
          setLoadingPhase('Buffering content...');
        } else if (progress < 75) {
          setLoadingPhase('Almost ready...');
        } else if (progress < 100) {
          setLoadingPhase('Finalizing...');
        } else {
          setLoadingPhase('Ready!');
          setTimeout(() => setVideoFullyLoaded(true), 500);
        }
      }
    };

    // Event listeners for loading progress
    const handleProgress = () => {
      updateLoadingProgress();
    };

    const handleCanPlayThrough = () => {
      console.log('Video can play through completely');
      setLoadingProgress(100);
      setLoadingPhase('Ready!');
      setTimeout(() => setVideoFullyLoaded(true), 500);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded');
      updateLoadingProgress();
    };

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded, duration:', video.duration);
      updateLoadingProgress();
    };

    // Force complete buffering
    const forceCompleteLoad = () => {
      if (video.readyState < 4) {
        // Jump through video to force complete download
        const duration = video.duration || 1;
        const jumpPoints = [0.1, 0.3, 0.5, 0.7, 0.9];
        let currentJump = 0;

        const jumpNext = () => {
          if (currentJump < jumpPoints.length) {
            try {
              video.currentTime = jumpPoints[currentJump] * duration;
              currentJump++;
              setTimeout(jumpNext, 200);
            } catch (e) {
              console.log('Jump failed:', e);
              currentJump++;
              setTimeout(jumpNext, 200);
            }
          } else {
            video.currentTime = 0;
            updateLoadingProgress();
          }
        };

        if (video.readyState >= 2) {
          jumpNext();
        }
      }
    };

    // Add all event listeners
    video.addEventListener('progress', handleProgress);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Start loading process
    video.load();

    // Check loading progress every 500ms
    const progressInterval = setInterval(updateLoadingProgress, 500);

    // Force complete load every 2 seconds if not done
    const forceLoadInterval = setInterval(() => {
      if (loadingProgress < 100) {
        forceCompleteLoad();
      }
    }, 2000);

    // Timeout fallback - if video doesn't load in 30 seconds, show anyway
    const loadingTimeout = setTimeout(() => {
      if (!videoFullyLoaded) {
        console.warn('Video loading timeout - showing content anyway');
        setVideoFullyLoaded(true);
      }
    }, 30000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(forceLoadInterval);
      clearTimeout(loadingTimeout);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const preloadVideo = async () => {
      try {
        const response = await fetch('/output.mp4');
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);

        if (videoRef.current) {
          videoRef.current.src = videoUrl;
          console.log('Video fully downloaded');
        }
      } catch (error) {
        console.error('Failed to preload video:', error);
      }
    };

    preloadVideo();
  }, []);

  useEffect(() => {
    if (videoLoaded) {
      const timer = setTimeout(() => {
        setLoading(false);
        setShowText(true);
      }, 1000); // Small delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [videoLoaded]);

  useEffect(() => {
    const lenis = new Lenis({ smooth: true, lerp: 0.1 });
    let rafId = null;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const video = videoRef.current;
    if (!video) return;

    video.load();

    video.pause();

    const updateVideo = () => {
      if (video.readyState < 2) return; // Make sure video is ready

      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScroll;

      const duration = video.duration || 1;
      video.currentTime = Math.min(scrollFraction * duration, duration - 0.001);
    };

    // Add error handling for video
    video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      console.error(
        'Video error code:',
        video.error ? video.error.code : 'unknown'
      );
      console.error(
        'Video error message:',
        video.error ? video.error.message : 'unknown'
      );
    });

    // Log video path to debug
    console.log(
      'Video path:',
      video.querySelector('source')?.src || 'No source found'
    );

    // Wait for video to be ready before setting up scroll handler
    video.addEventListener('loadedmetadata', () => {
      console.log('Video metadata loaded, duration:', video.duration);
      updateVideo(); // Initial call
    });

    // Add this to debug network issues
    console.log('Attempting to fetch video directly');
    fetch('/output.mp4')
      .then((response) => {
        console.log(
          'Video fetch response:',
          response.status,
          response.statusText
        );
        return response.blob();
      })
      .then((blob) => console.log('Video blob loaded, size:', blob.size))
      .catch((err) => console.error('Video fetch error:', err));

    // Glitch effect interval
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, Math.random() * 5000 + 1000);

    const animate = () => {
      updateVideo();

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const slowSection = slowSectionRef.current;
      const slowTop = slowSection?.offsetTop || 0;
      const slowBottom = slowTop + (slowSection?.offsetHeight || 0);

      if (
        slowSection &&
        scrollTop + windowHeight > slowTop &&
        scrollTop < slowBottom
      ) {
        lenis.options.lerp = 0.03;
      } else {
        lenis.options.lerp = 0.1;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize GSAP animations
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

    if (dreamSectionRef.current) {
      gsap.to('.dream-section-heading', {
        scrollTrigger: {
          trigger: dreamSectionRef.current,
          start: 'top 80%',
          onEnter: () =>
            document
              .querySelector('.dream-section-heading')
              ?.classList.add('visible'),
          onLeave: () =>
            document
              .querySelector('.dream-section-heading')
              ?.classList.remove('visible'),
          onEnterBack: () =>
            document
              .querySelector('.dream-section-heading')
              ?.classList.add('visible'),
          onLeaveBack: () =>
            document
              .querySelector('.dream-section-heading')
              ?.classList.remove('visible'),
        },
      });

      document.querySelectorAll('.dream-note').forEach((note, index) => {
        gsap.to(note, {
          scrollTrigger: {
            trigger: note,
            start: 'top 85%',
            onEnter: () => {
              note.classList.add('visible');
              if (typeof createMemoryTrail === 'function') {
                createMemoryTrail(note);
              }
            },
          },
        });
      });

      // Only call if function exists
      if (typeof createDreamParticles === 'function') {
        createDreamParticles();
      }
    }

    gsap.fromTo(
      '.final-pop-text',
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.final-text-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    if (finalSectionRef.current) {
      gsap.fromTo(
        '.final-message',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: finalSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    const adjustFinalSection = () => {
      const scrollContent = document.querySelector('.scrollContent');
      if (scrollContent && finalSectionRef.current) {
        const totalHeight = parseInt(scrollContent.style.height);
        finalSectionRef.current.style.position = 'absolute';
        finalSectionRef.current.style.bottom = '0';
        finalSectionRef.current.style.width = '100%';
        finalSectionRef.current.style.height = '100vh';
      }
    };

    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', updateVideo); // Add scroll event listener
    adjustFinalSection();
    window.addEventListener('resize', adjustFinalSection);

    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      cancelAnimationFrame(rafId);
      clearInterval(glitchInterval);
      window.removeEventListener('resize', adjustFinalSection);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', updateVideo);
      if (video) {
        video.removeEventListener('loadedmetadata', updateVideo);
        video.removeEventListener('error', () => {});
      }
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setShowText(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${cursorPosition.x}px`;
      cursorRef.current.style.top = `${cursorPosition.y}px`;
    }
  }, [cursorPosition]);

  useEffect(() => {
    if (!videoFullyLoaded) return;

    const video = videoRef.current;
    if (!video) return;

    // Your existing scroll control logic here
    const updateVideo = () => {
      if (video.readyState < 2) return;

      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      const duration = video.duration || 1;
      const targetTime = Math.min(scrollFraction * duration, duration - 0.1);

      try {
        video.currentTime = targetTime;
      } catch (error) {
        console.error('Error setting video time:', error);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', updateVideo);

    // Initial call
    updateVideo();

    return () => {
      window.removeEventListener('scroll', updateVideo);
    };
  }, [videoFullyLoaded]);

  const createMemoryTrail = (noteElement) => {
    const position = noteElement.classList.contains('left') ? 'right' : 'left';
    const trailsCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < trailsCount; i++) {
      setTimeout(() => {
        const trail = document.createElement('div');
        trail.className = `memory-trail ${position}`;

        const rect = noteElement.getBoundingClientRect();
        const section = document.querySelector('.dream-memory-section');
        const sectionRect = section.getBoundingClientRect();

        const x =
          position === 'left'
            ? rect.right + Math.random() * 150
            : rect.left - Math.random() * 150;

        const y = rect.top + Math.random() * rect.height - sectionRect.top;

        trail.style.left = `${x - sectionRect.left}px`;
        trail.style.top = `${y}px`;

        section.appendChild(trail);

        setTimeout(() => {
          trail.classList.add('visible');

          setTimeout(() => {
            trail.remove();
          }, 8000);
        }, 100);
      }, i * 400);
    }
  };

  const createDreamParticles = () => {
    const section = document.querySelector('.dream-memory-section');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'dream-particles';
    section.appendChild(particlesContainer);

    for (let i = 0; i < 80; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.opacity = Math.random() * 0.5;

      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 15;
      particle.style.animation = `float-particle ${duration}s ${delay}s infinite linear`;

      particlesContainer.appendChild(particle);
    }
  };

  const handlePlayAudio = () => {
    if (!isPlaying && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Failed to play audio:', err);
        });
    }
  };

  const LoadingScreen = () => (
    <div className={`loading-screen ${videoFullyLoaded ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-circle"></div>
        </div>
        <div className="loading-text">
          <h2>{loadingPhase}</h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p>{loadingProgress.toFixed(1)}% loaded</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <LoadingScreen />
      <div>
        <AnimatedCursor
          innerSize={8}
          outerSize={20}
          color="255, 255, 255"
          outerAlpha={0.5}
          innerScale={0.7}
          outerScale={5}
        />
        <Progressbar />
        <div>
          <div>
            {showText && (
              <div
                className="cursor-text"
                style={{
                  left: `${mousePosition.x + 15}px`,
                  top: `${mousePosition.y + 15}px`,
                }}
              >
                Click anywhere to enable sound
              </div>
            )}
          </div>
        </div>
        <audio loop ref={audioRef} preload="auto">
          <source src="/audio.mp3" type="audio/mpeg" />
        </audio>
        <div
          ref={cursorRef}
          className={`custom-cursor ${isPlaying ? '' : 'music-cursor'}`}
          onClick={handlePlayAudio}
        ></div>
        <div style={{ position: 'relative' }} onClick={handlePlayAudio}>
          <video ref={videoRef} className="video">
            <source src="/output.mp4" type="video/mp4" />
          </video>

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
                <h1 className="liminal-title">LIMINALITY.</h1>
                <p className="liminal-subtitle">
                  A Tiny Website in this Corner of the Internet by Amey.
                </p>
              </div>
            </div>
            <section
              style={{ backgroundColor: 'transparent', height: '400vh' }}
            ></section>
            <section ref={slowSectionRef} className="liminal-text-section">
              <div
                className={`text-container ${
                  glitchActive ? 'text-glitch' : ''
                }`}
              >
                <h1 className="liminal-heading">Neither here, nor there.</h1>
                <p className="liminal-paragraph">
                  Liminal spaces are the transitory places we often pass
                  through, including stairwells, doorways, school hallways at
                  night, empty malls. Yet, unlike normal spaces, they invoke a
                  strong sense of emotion within oneself. They exist on the edge
                  of familiarity and dreams, evoking feelings of nostalgia,
                  unease, and stillness. <br /> <br />
                  The word liminal comes from the Latin limen, meaning
                  "threshold." These spaces are thresholds, not quite one place
                  or another, but somewhere in between. They often appear empty
                  or abandoned, yet strangely familiar, as if you've seen them
                  in a dream or memory.
                </p>
              </div>
            </section>
            <section className="floating-text-section">
              <h2 className="floating-text">
                Many pass through, but only few truly see it..
              </h2>
            </section>
            <section style={{ height: '100vh' }}></section>
            <section ref={slowSectionRef} className="liminal-text-section">
              <div
                className={`text-container ${
                  glitchActive ? 'text-glitch' : ''
                }`}
              >
                <h1 className="liminal-heading">Surreality. Fear. Unease.</h1>
                <p className="liminal-paragraph">
                  Liminality isn't always obvious, it is a feeling that creeps
                  in quietly. It is the echo of forgotten places, the eerie
                  stillness of a memory you can't quite place. It stirs
                  something deep: old forgotten dreams, distant childhood
                  moments, emotions without names. Not everyone notices it. But
                  once you do, it stays with you.
                  <br /> <br /> Liminal spaces feel off because they are
                  in-between places. They aren't meant to be destinations — just
                  paths. But when they're empty or frozen in time, your brain
                  doesn't know how to process them. That's where the unease,
                  nostalgia, and surreal feeling comes from.
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
                className={`text-container ${
                  glitchActive ? 'text-glitch' : ''
                }`}
                ref={slowSectionRef}
              >
                <h1 className="liminal-heading">Think about it...</h1>
                <p className="liminal-paragraph">
                  Imagine standing in your childhood nursery. You remember it
                  all: the laughter, the chaos, the voices of children and
                  teachers echoing through the air. It was alive, bursting with
                  noise and movement. Now, imagine walking back in — years
                  later. The classroom is abandoned, dark, silent. Frozen in
                  time. The things are still there, but the souls are gone. The
                  voices are gone. Everything has moved on — the sounds, the
                  people, the energy. What's left is a shell. Familiar, but
                  hollow.
                  <br /> <br /> That quiet unease you feel? That's liminality.
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
                className={`text-container ${
                  glitchActive ? 'text-glitch' : ''
                }`}
              >
                <h1 className="liminal-heading">Liminal Comfort...?</h1>
                <p className="liminal-paragraph">
                  Not everyone fears liminal spaces. For some, these quiet,
                  in-between places are a form of sanctuary. They find comfort
                  in the stillness, in the soft hum of fluorescent lights, in
                  the untouched dust of an empty hallway, in the silence of a
                  room long forgotten. These spaces do not demand, they do not
                  rush. They simply exist.
                  <br />
                  <br />
                  Here, time doesn't push you forward. Expectations fade. You
                  are no one and nowhere here. For those who find the world too
                  loud, too sharp, too real...liminal places offer a pause. A
                  breath between chapters. A place to disappear, gently.
                  <br />
                  <br />
                  It's not about being lost. It's about being free, in the
                  briefest of moments, from everything else.
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
            <section style={{ height: '500vh' }}></section>
            <section ref={dreamSectionRef} className="dream-memory-section">
              <h2 className="dream-section-heading">DREAM FRAGMENTS</h2>
              <div className="dream-notes">
                {dreamNotes.map((note, index) => (
                  <div className={`dream-note ${note.position}`} key={index}>
                    <div className="dream-note-title">{note.title}</div>
                    <p>{note.content}</p>
                    <div className="dream-date">{note.date}</div>
                  </div>
                ))}
              </div>
            </section>
            <section style={{ height: '300vh' }}></section>
            <section className="final-text-section" style={{ height: '100vh' }}>
              <div className="final-pop-text floating-text">
                Are you truly alone, though?
              </div>
            </section>
            <section
              ref={slowSectionRef}
              className="liminal-text-section"
              style={{ height: '200vh' }}
            >
              <div
                className={`text-container ${
                  glitchActive ? 'text-glitch' : ''
                }`}
              >
                <h1 className="liminal-heading">
                  Existence of Other Entities?
                </h1>
                <p className="liminal-paragraph">
                  What exactly is the fear we feel in liminal spaces? It isn't
                  the fear of some visible entity. Rather, it's deeper, more
                  primal. These places were once alive, buzzing with footsteps,
                  echoes of laughter, the warmth of presence. Now they stand
                  still, stripped of context, abandoned by time.
                  <br /> <br />
                  It is not what we see that unnerves us, but what we expect to
                  see and don't. Our minds fill the silence with whispers, with
                  figures that don't exist (or shouldn't). The fear is born from
                  the unnatural emptiness, the wrongness of familiarity turned
                  hollow. These spaces aren't haunted by beings...they're
                  haunted by absence. The true 'fear' we feel is not of any
                  unnatural entity. Rather, it is the idea, of liminality
                  itself...
                </p>
              </div>
            </section>
            <section style={{ height: '100vh' }}></section>
            <section
              className="final-text-section"
              style={{ height: '100vh' }}
              ref={slowSectionRef}
            >
              <div className="final-pop-text floating-text">
                It is not empty. It is merely waiting...
              </div>
            </section>
            <section
              ref={slowSectionRef}
              className="liminal-text-section"
              style={{ height: '200vh' }}
            >
              <div
                className={`text-container ${
                  glitchActive ? 'text-glitch' : ''
                }`}
              >
                <h1 className="liminal-heading">Liminal Existence.</h1>
                <p className="liminal-paragraph">
                  What if...life in itself is liminal? What if the universe is
                  liminal? What if everything, we see and percieve, is nothing
                  but a transitory reality, bridging the gaps between something
                  much greater, much more enigmatic? <br /> <br />
                  Life is, after all, a bridge between birth and death. A
                  momentary journey between two unknowns. What came before? And
                  what is going to come after? Alas, we'll never know. For now,
                  we're the ones who are suspended in the space between...
                </p>
              </div>
            </section>
            <section style={{ height: '700vh' }}></section>
            <section
              className="final-text-section"
              style={{ height: '100vh' }}
              ref={slowSectionRef}
            >
              <div className="final-pop-text floating-text">
                You are not alone now. But when you are truly alone, you will
                feel it: a silence so profound, it will echo through your very
                being.
              </div>
            </section>
            <section
              ref={finalSectionRef}
              className="final-section"
              style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                background: 'rgba(0, 0, 0, 0.5)',
                position: 'sticky',
                bottom: 0,
                width: '100%',
                zIndex: 10,
              }}
            >
              <h2 className="final-message">
                The End Is Just Another Beginning.
              </h2>
              <p>
                Check out some other cool stuff of mine{' '}
                <underline>
                  <span
                    className="final-span"
                    onClick={() =>
                      window.open('https://ameyvijeesh.netlify.app')
                    }
                  >
                    here
                  </span>
                </underline>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
