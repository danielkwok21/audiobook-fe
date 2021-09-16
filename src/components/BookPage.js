// import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams
} from "react-router-dom";
import './bookpage.css'
import { useEffect, useState, useRef } from 'react'
import { getAudio, getBooks, getChapters, getProgress, getThumbnail, updateProgress } from '../services/api';
import {
  Card, PageHeader, Slider
} from 'antd'
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons'


function TitlePage() {

  const ref = useRef(null)
  const params = useParams()
  const history = useHistory()
  let timerRef = null

  function getUrlParams() {

    const [a, b, title, chapter, urlProgress] = window.location.pathname.split("/")

    return {
      title: decodeURIComponent(title), chapter, urlProgress
    }
  }


  const [chapters, setChapters] = useState([])
  const [isPlay, setIsPlay] = useState(true)
  const [thumbnail, setThumbnail] = useState(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const BLACK = 'black'
  const { title, chapter, urlProgress } = getUrlParams()

  useEffect(() => {
    getChapters(title)
      .then(res => {

        setChapters(res.chapters)
        setThumbnail(res.thumbnail)

        return getProgress(title, chapter)
          .then(res2 => {
            if (res2.progress) {
              history.replace(`/book/${title}/${res2.progress.chapter}`)
              ref.current.currentTime = res2.progress.progress
            } else {
              history.replace(`/book/${title}/${res.chapters[0]}`)
            }
          })
      })

    timerRef = setInterval(() => {
      if (!ref.current) return null
      const currentDuration = ref.current.currentTime

      const { title, chapter, urlProgress } = getUrlParams()

      updateProgress(title, chapter, currentDuration)
    }, 3 * 1000)

  }, [])


  const audioUrl = chapter && getAudio(title, chapter)
  const index = chapters.findIndex(c => c === chapter)

  const minute = (duration / 60 || 0).toFixed(0).padStart(2, '0')
  const second = (duration % 60 || 0).toFixed(0).padStart(2, '0')

  const currentDuration = duration * progress / 100
  const currentMinute = (currentDuration / 60 || 0).toFixed(0).padStart(2, '0')
  const currentSecond = (currentDuration % 60 || 0).toFixed(0).padStart(2, '0')

  function audioElOnTimeUpdate(e) {
    const videoEl = e.currentTarget
    const progress = videoEl.currentTime / videoEl.duration * 100

    setProgress(progress)
  }

  function onNext() {
    if (index === chapters.length - 1) return null
    const nextIndex = index + 1
    const nextChapter = chapters[nextIndex]

    history.replace(`/book/${title}/${nextChapter}`)
  }

  function onPrev() {
    if (index === 0) return null
    const prevIndex = index - 1
    const prevChapter = chapters[prevIndex]

    history.replace(`/book/${title}/${prevChapter}`)

  }

  function next15() {
    ref.current.currentTime = Math.min(ref.current.currentTime + 15, ref.current.duration)
  }

  function prev15() {

    ref.current.currentTime = Math.max(ref.current.currentTime - 15, 0)
  }

  return (
    <div
      style={{
        textAlign: 'center'
      }}
    >
      <PageHeader
        onBack={() => history.goBack()}
        title={`${chapter}`}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >

        <img
          style={{
            borderRadius: 10,
            display: 'inline-block',
            margin: 10,
            objectFit: 'scale-down',
            height: 300
          }}
          src={thumbnail && getThumbnail(params.title, thumbnail)}
        />
        <video
          ref={ref}
          // controls
          onPause={() => setIsPlay(false)}
          onPlay={() => setIsPlay(true)}
          onLoadedData={e => {
            const videoEl = e.currentTarget
            setDuration(videoEl.duration)
            if (urlProgress) videoEl.currentTime = urlProgress
          }}
          autoPlay={true}
          onTimeUpdate={audioElOnTimeUpdate}
          style={{
            height: 20
          }}
          src={audioUrl}>

        </video>
        <h1>{title}</h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <p>{currentMinute} : {currentSecond}</p>
          <p>{minute} : {second}</p>
        </div>
        <Slider
          value={progress}
          min={0}
          max={100}
          // tipFormatter={percentage => {
          //   if (ref.current) {

          //     const currentDuration = ref.current.duration * percentage / 100

          //     const minute = currentDuration / 60
          //     const second = currentDuration % 60

          //     return <div style={{display: 'flex' }}>
          //       <p>{minute.toFixed(0)}</p> : <p>{second.toFixed(0)}</p>
          //     </div>
          //   }
          // }}
          onChange={percentage => {
            const currentTime = Number((duration * percentage / 100).toFixed(2))
            ref.current.currentTime = currentTime
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <StepBackwardOutlined
            style={{
              fontSize: 50,
              color: index === 0 ? 'grey' : BLACK,
            }}
            onClick={onPrev}
          />
          <img
            style={{
              cursor: 'pointer'
            }}
            onClick={prev15}
            src="https://img.icons8.com/ios/50/000000/skip-15-seconds-back.png" />
          {
            isPlay ?
              <PauseCircleOutlined
                style={{
                  fontSize: 50,
                  color: BLACK,
                  margin: 5,
                }}
                onClick={() => {
                  ref.current.pause()
                  setIsPlay(false)
                }}
              />
              :
              <PlayCircleOutlined
                style={{
                  fontSize: 50,
                  color: BLACK,
                }}
                onClick={() => {
                  ref.current.play()
                  setIsPlay(true)
                }}
              />
          }

          <img
            style={{
              cursor: 'pointer'
            }}
            onClick={next15}
            src="https://img.icons8.com/ios/50/000000/skip-ahead-15-seconds.png" />
          <StepForwardOutlined
            onClick={onNext}
            style={{
              fontSize: 50,
              color: index === chapters.length - 1 ? 'grey' : BLACK,
            }}

          />
        </div>
      </div>

    </div >
  );
}

export default TitlePage;
