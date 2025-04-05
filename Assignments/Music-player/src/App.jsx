import { useState,useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import rgbaster from 'rgbaster';

import './SCSS/main.css';

import Logo from './assets/Logo.svg';
import UserImg from './assets/user.png';
import SearchIcon from './assets/search-icon.svg'
import Songs from './assets/Json/songs.json';
import BackgroundOverlay from './BackgroundOverlay';

function App() {
  const [activeTab, setActiveTab] = useState('For You');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([...Songs.songs]);
  const [topTracks, setTopTracks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [incomingGradient, setIncomingGradient] = useState('')
  const [currentBackground, setCurrentBackground] = useState('');
  const [dominantColor, setDominantColor] = useState('');
  const [isTransitioning, setIstransitioning] = useState(false);
  const [isMuted, setisMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage', error);
      return [];
    }
  });
  
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const storedRecentPlayed = sessionStorage.getItem('recentlyPlayed');
      return storedRecentPlayed ? JSON.parse(storedRecentPlayed) : [];
    } catch (error) {
      console.error('Error loading recently played from sessionStorage', error);
      return [];
    }
  });

  const audioRef = useRef(null);

  alert("if background color doesn't change then refresh the page and try again. Also if anything else is not working then also refresh the page.")

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    generateTopTracks();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      sessionStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    } catch (error) {
      console.error('Error saving recentlyPlayed to localStorage:', error);
    }
  }, [recentlyPlayed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = Songs.songs[currentSongIndex].musicUrl;
      if (isPlaying) {
        audioRef.current.play();
      }
    }

    extractDominantColor(Songs.songs[currentSongIndex].thumbnail);
  }, [currentSongIndex, isPlaying]);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && audioRef.current.duration) {
        const progressPercentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(progressPercentage);
      }
    };

    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (audioEl) {
        audioEl.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

   useEffect(() => {
      if (audioRef.current) {
        audioRef.current.src = Songs.songs[currentSongIndex].musicUrl;
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;
        
        if (isPlaying) {
          audioRef.current.play();
        }
      }

      extractDominantColor(Songs.songs[currentSongIndex].thumbnail);
    }, [currentSongIndex, isPlaying, volume, isMuted]);

  useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredSongs([...Songs.songs]);
      } else {
        const term = searchTerm.toLowerCase();
        const filtered = Songs.songs.filter(song => 
          song.title.toLowerCase().includes(term) ||
          song.artistName.toLowerCase().includes(term)
        );
        setFilteredSongs(filtered);
      }
    }, [searchTerm]);

  const toggelMute = () => {
    if(audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setisMuted(newMuteState);

      if (!newMuteState && volume === 0) {
        setVolume(0.5);
        audioRef.current.volume = 0.5;
      }
    }
  }

   const extractDominantColor = async (imageUrl) => {
    if (isTransitioning) return;

    try {
      setIstransitioning(true);

      const result = await rgbaster(imageUrl, {
        paletteSize: 5, // Get 5 dominant colors
        exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'] // Exclude pure white/black
      });

      // Get dominant and secondary colors
      const dominant = result[0].color;
      setDominantColor(dominant)
      const secondary = result[1]?.color || dominant;

      const newGradient = `linear-gradient(to bottom, ${dominant}, ${secondary})`;
      setIncomingGradient(newGradient);
      
    } catch (error) {
      console.error('Color extraction failed:', error);
      // Fallback to random colors
      const randomColor1 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
      const randomColor2 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
      setIncomingGradient(`linear-gradient(to bottom, ${randomColor1}, ${randomColor2})`);
    }
  };

    const handleOverlayTransitionEnd = () => {
      setCurrentBackground(incomingGradient);

      setTimeout(() => {
        setIstransitioning(false);
      }, 100);
    };

  function lightenColor(color, percent) {
    // Extract the numbers from "rgb(r, g, b)"
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return color; // fallback if format is unexpected
    let [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    
    // Increase each component toward 255 by the given percentage
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
    
    return `rgb(${r}, ${g}, ${b})`;
  }


  const generateTopTracks = () => {
    const shuffled = [...Songs.songs];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

    }

    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    const ranked = selected.map((song, index) => ({
      ...song,
      rank: index + 1
    }));

    setTopTracks(ranked);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const nextIndex = (currentSongIndex + 1) % Songs.songs.length;
    setCurrentSongIndex(nextIndex);
    addToRecentlyPlayed(nextIndex);
    setIsPlaying(true);

  }
  const playPrevious = () => {
    const prevIndex = (currentSongIndex - 1 + Songs.songs.length) % Songs.songs.length;
    setCurrentSongIndex(prevIndex);
    addToRecentlyPlayed(prevIndex);
    setIsPlaying(true);
  }

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    addToRecentlyPlayed(index);
  }

  const addToRecentlyPlayed = (index) => {
    const songToAdd = Songs.songs[index];

    const isAlreadyList = recentlyPlayed.some(song => song.id === songToAdd.id);

    if (!isAlreadyList) {
      setRecentlyPlayed(prev => [songToAdd, ...prev.slice(0,9)]);
    } else {
      setRecentlyPlayed(prev => [
        songToAdd,
        ...prev.filter(song => song.id !== songToAdd.id)
      ])
    }
  }

  const toggeleFavorite = (songId) => {
    const songToToggle = Songs.songs.find(song => song.id === songId);
    if (!songToToggle) return;

    const isAlreadyFavourite = favorites.some(song => song.id === songId);

    if (isAlreadyFavourite) {
      setFavorites(prev => prev.filter(song => song.id !== songId));
    } else {
      setFavorites(prev => [songToToggle, ...prev]);
    }
  }

  const isFavorite = (songId) => {
    return favorites.some(song => song.id === songId);
  }

  const handleSearch = (e) => {
    e.preventDefault();
  }

  const renderSongItem = (song, index, isTopTrack = false) => {
    const isCurrent = Songs.songs[currentSongIndex].id === song.id;
    
    return (
      <Row 
        key={index} 
        xs={12} 
        md={6} 
        lg={4} 
        className={`song-item mb-3 ${isCurrent ? 'active-song' : ''}`}
        onClick={() => {
          const songIndex = Songs.songs.findIndex(s => s.id === song.id);
          if (songIndex !== -1) {
            playSong(songIndex);
          }
        }}
      >
        <div className='img-name-container'>
          {isTopTrack && <span className="rank-badge">{song.rank}</span>}
          <Image src={song.thumbnail} alt={song.title} fluid />
          <div className="name-container">
            <h3>{song.title}</h3>
            <p>{song.artistName}</p>
          </div>
        </div>
        <p>{song.duration}</p>
      </Row>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'For You':
        const searchInputColor = dominantColor ? lightenColor(dominantColor, 70) : 'white';
        return (
          <div className='for-you-container'>
            <h1>For You</h1>
            <form onSubmit={handleSearch}>
                <InputGroup className="mb-3">
                <Form.Control 
                  placeholder="Search Song, Artist" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ backgroundColor: searchInputColor, borderColor: searchInputColor }}
                  />
                <Button style={{background: searchInputColor, border: 'none'}} type='submit' >
                  <Image src={SearchIcon} alt="search icon" fluid />
                </Button>
              </InputGroup>
            </form>
            <Row>
                {filteredSongs.length > 0 ? (
                  filteredSongs.map((song, index) => renderSongItem(song, index))
                ) : (
                  <Col xs={12} md={6} lg={4}>
                    <p>No songs found matching your search.</p>
                  </Col>
                )}
            </Row>
          </div>
        );
      case 'Top Tracks':
        return (
          <div className='for-you-container'>
            <h1>Top Tracks</h1>
            <Row>
              {topTracks.length > 0 ? (
                topTracks.map((song, index) => renderSongItem(song, index, true))
              ) : (
                <Col xs={12} md={6} lg={4}>
                  <p>No top tracks available.</p>
                </Col>
              )}
            </Row>
          </div>
        );
      case 'Favourites':
        return (
          <div className='for-you-container'>
            <h1>Favourites</h1>
            <Row xs={12} md={6} lg={4}>
              {favorites.length > 0 ? (
                favorites.map((song, index) => renderSongItem(song, index))
              ) : (
                <Row xs={12} md={6} lg={4}>
                  <p>No favorites songs yet. Click the three dots on a song to add it to favorites</p>
                </Row>
              )
            }
            </Row>
          </div>
        )
      case 'Recently Played':
         return (
          <div className='for-you-container'>
            <h1>Recently Played</h1>
            <Row>
              {recentlyPlayed.length > 0 ? (
                recentlyPlayed.map((song, index) => renderSongItem(song, index))
              ) : (
                <Col xs={12} md={6} lg={4}>
                  <p>No recently played songs yet.</p>
                </Col>
              )}
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  const currentSong = Songs.songs[currentSongIndex];

 // Updated responsive layout code
  return (
    <Container fluid className="main-container">
      <div 
        className="base-background" 
        style={{ background: currentBackground }}
      />
      
      <BackgroundOverlay 
        gradient={incomingGradient} 
        onTransitionEnd={handleOverlayTransitionEnd}
      />
      <Row className="content-row">
        {/* Sidebar - visible on all screens above 768px or when toggled on mobile */}
        {(!isMobile || sidebarOpen) && (
          <Col xs={12} md={2} className={`side-panel ${isMobile ? 'mobile-side-panel' : ''}`}>
            <div className='sidebar-header'>
              <Image src={Logo} alt='logo' fluid className='logo-img'/>
              {isMobile && (
                <Button
                  variant='link'
                  className='close-sidebar-btn'
                  onClick={toggleSidebar}
                >
                  &times;
                </Button>
              )}
            </div>
            <Nav variant="pills" className="flex-column mt-2">
              <Nav.Link onClick={() => setActiveTab('For You')} active={activeTab === 'For You'} className='navigation-links'>
                For You
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('Top Tracks')} active={activeTab === 'Top Tracks'} className='navigation-links'>
                Top Tracks
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('Favourites')} active={activeTab === 'Favourites'} className='navigation-links'>
                Favourites
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('Recently Played')} active={activeTab === 'Recently Played'} className='navigation-links'>
                Recently Played
              </Nav.Link>
            </Nav>
            <div className="profile-img-container">
              <Image src={UserImg} alt="Profile" fluid />
            </div>
          </Col>
        )}

        {/* Main content area */}
        <Col xs={12} md={isMobile && !sidebarOpen ? 12 : 5} 
            className={`feature-container ${isMobile && sidebarOpen ? 'd-none' : ''}`}>
          {isMobile && !sidebarOpen && (
            <Button
              variant='link'
              className='toggle-sidebar-btn'
              onClick={toggleSidebar}
            >
              ≡
            </Button>
          )}
          {renderContent()}
        </Col>

        {/* Music player area */}
        <Col xs={12} md={isMobile && !sidebarOpen ? 12 : 5} 
            className={`music-player-container ${isMobile ? 'mobile-player' : ''} ${isMobile && sidebarOpen ? 'd-none' : ''}`}>
          <h1>{currentSong.title}</h1>
          <p>{currentSong.artistName}</p>
          <Image src={currentSong.thumbnail} alt="Cover of the music" fluid className='music-cover-img'/>
          <div className="music-progress-bar-container">
            <div 
              className="music-progress-bar"
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'gray',
                marginTop: '10px',
                borderRadius: '5px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: 'white',
                  transition: 'width 0.1s linear'
                }}
              ></div>
            </div>
          </div>
          <div className="main-music-player-control-container mt-3">
            <button className={`three-dots ${isFavorite(currentSong.id) ? 'favorited' : ''}`} 
              onClick={() => toggeleFavorite(currentSong.id)}
            >
              <span className="circle"></span>
              <span className="circle"></span>
              <span className="circle"></span>
            </button>
            <div className="player-controls">
              <button id="previous-button" onClick={playPrevious} className="control-btn">
                <i className="fas fa-step-backward"></i>
              </button>
              <button id="play-pause-button" onClick={togglePlayPause} className="play-btn mx-2">
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <button id="next-button" onClick={playNext} className="control-btn">
                <i className="fas fa-step-forward"></i>
              </button>
            </div>
            <div className="volume-control-wrapper">
              <button id="sound-button" onClick={toggelMute} className="sound-btn">
                <i className={`fas ${isMuted ? 'fa-volume-mute' : volume > 0.5 ? 'fa-volume-up' : 'fa-volume-down'}`}></i>
              </button>
            </div>
          </div>
          <audio ref={audioRef} onEnded={playNext}/>
          
          {isMobile && !sidebarOpen && (
            <button 
              className="show-playlist-btn mt-4"
              onClick={toggleSidebar}
            >
              Show Playlist
            </button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
