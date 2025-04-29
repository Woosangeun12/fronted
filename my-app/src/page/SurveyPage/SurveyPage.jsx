import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './SurveyPage.css';

const SurveyPage = () => {
  const nickname = sessionStorage.getItem('nickname');
  const [step, setStep] = useState(1);
  const [feeling, setFeeling] = useState('');
  const [preferredGenre, setPreferredGenre] = useState('');
  const [origin, setOrigin] = useState('');
  const [style, setStyle] = useState('');
  const [hate, setHate] = useState('');
  const navigate = useNavigate();

  const handleFeeling = (selectedFeeling) => {
    setFeeling(selectedFeeling);
    setStep(2);
  };

  const handleResponse = (answer) => {
    console.log(`감정: ${feeling}, 선택한 방법: ${answer}`);
    setStyle(answer);
    setStep(3);
  };

  const handleGenreSelect = (genre) => {
    console.log(`선호 장르: ${genre}`);
    setPreferredGenre(genre);
    setStep(4);
  };

  const handleAvoidSelect = (genre) => {
    console.log(`피하고 싶은 장르: ${genre}`);
    setHate(genre);
    setStep(5);
  };

  const handleOriginSelect = async (selectedOrigin) => {
    setOrigin(selectedOrigin);
    const visitorId = sessionStorage.getItem('visitorId');

    const surveyResult = {
      emotion: feeling,
      style: style,
      genre: preferredGenre,
      origin: selectedOrigin,
      hate: hate,
    };

    try {
      await api.post(`/api/survey/submit/${visitorId}`, surveyResult);
      alert(`${nickname}님의 설문이 완료되었습니다! 🎉\n\n👉 추천 결과를 준비할게요!`);
      navigate('/recommend');
    } catch (error) {
      console.error('설문 저장 실패:', error);
      alert('설문 저장 중 오류가 발생했어요.');
    }
  };


  return (
    <div className="survey-container">
      <div className="survey-box">
        <h2>{nickname}님,</h2>

        {step === 1 && (
          <>
            <h3>지금 기분이 어때요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleFeeling("우울해")} className="feeling-btn">😢 우울해</button>
              <button onClick={() => handleFeeling("기분 좋아")} className="feeling-btn">😊 기분 좋아</button>
              <button onClick={() => handleFeeling("지루해")} className="feeling-btn">😐 지루해</button>
              <button onClick={() => handleFeeling("스트레스 받아")} className="feeling-btn">🤯 스트레스 받아</button>
            </div>
          </>
        )}

        {step === 2 && feeling === '우울해' && (
          <>
            <h3>우울하거나 슬플 때, 당신은 그 감정을 어떻게 달래나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleResponse("산책이나 가벼운 운동")}>🏃 산책이나 가벼운 운동<br /></button>
              <button onClick={() => handleResponse("친구나 가족과 대화")}>👪 친구나 가족과 대화<br /></button>
              <button onClick={() => handleResponse("책이나 영화에 몰입")}>📚 책이나 영화에 몰입<br /></button>
              <button onClick={() => handleResponse("유머와 코미디")}>😂 유머와 코미디 즐기기<br /></button>
            </div>
          </>
        )}

        {step === 2 && feeling === '기분 좋아' && (
          <>
            <h3>행복하거나 기쁠 때, 그 긍정적인 감정을 어떻게 유지하거나 증폭시키시나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleResponse("새로운 경험에 도전하기")}>✨ 새로운 경험에 도전하기<br /><small>– 기분을 더욱 고조시키기</small></button>
              <button onClick={() => handleResponse("가까운 사람들과 시간 보내기")}>👨‍👩‍👧‍👦 사람들과 시간 보내기<br /><small>– 안정감과 위로</small></button>
              <button onClick={() => handleResponse("좋아하는 일에 몰입하기")}>🎨 좋아하는 일 몰입<br /><small>– 집중과 즐거움</small></button>
              <button onClick={() => handleResponse("유쾌한 유머 콘텐츠 즐기기")}>😂 유머 콘텐츠 즐기기<br /><small>– 웃음으로 긍정 유지</small></button>
            </div>
          </>
        )}

        {step === 2 && feeling === '스트레스 받아' && (
          <>
            <h3>스트레스나 불안을 느낄 때, 당신은 그 감정을 어떻게 해소하나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleResponse("짧은 산책이나 운동")}>🏃 짧은 산책이나 운동<br /><small>– 신체 활동으로 긴장 해소</small></button>
              <button onClick={() => handleResponse("명상이나 조용한 시간")}>🧘 명상이나 조용한 시간<br /><small>– 내면의 평화</small></button>
              <button onClick={() => handleResponse("몰입 콘텐츠")}>🎬 몰입할 콘텐츠 보기<br /><small>– 불안 잊기</small></button>
              <button onClick={() => handleResponse("웃는 대화")}>😄 친구와 웃는 대화<br /><small>– 즐거움으로 스트레스 날리기</small></button>
            </div>
          </>
        )}

        {step === 2 && feeling === '지루해' && (
          <>
            <h3>지루하거나 무기력할 때, 당신은 그 상태를 어떻게 극복하시나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleResponse("새로운 활동에 도전하기")}>🚴 새로운 활동에 도전하기<br /><small>– 일상 탈피로 기분 전환</small></button>
              <button onClick={() => handleResponse("감동적인 이야기나 영화 보기")}>🎥 감동적인 이야기 보기<br /><small>– 감정 자극으로 에너지 얻기</small></button>
              <button onClick={() => handleResponse("취미나 프로젝트 참여")}>🎯 취미나 프로젝트 참여<br /><small>– 몰입으로 무기력 해소</small></button>
              <button onClick={() => handleResponse("유쾌한 코미디 보기")}>🤣 유쾌한 코미디 보기<br /><small>– 웃음으로 지루함 날리기</small></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3>어떤 장르의 영화를 좋아하나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleGenreSelect("SF")}>🚀 SF</button>
              <button onClick={() => handleGenreSelect("로맨스")}>💕 로맨스</button>
              <button onClick={() => handleGenreSelect("코미디")}>😂 코미디</button>
              <button onClick={() => handleGenreSelect("스릴러")}>🔪 스릴러</button>
              <button onClick={() => handleGenreSelect("판타지")}>🧙‍♂️ 판타지</button>
              <button onClick={() => handleGenreSelect("애니메이션")}>🎨 애니메이션</button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3>피하고 싶은 영화 장르가 있다면 알려주세요</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleAvoidSelect("SF")}>🚀 SF</button>
              <button onClick={() => handleAvoidSelect("로맨스")}>💕 로맨스</button>
              <button onClick={() => handleAvoidSelect("코미디")}>😂 코미디</button>
              <button onClick={() => handleAvoidSelect("스릴러")}>🔪 스릴러</button>
              <button onClick={() => handleAvoidSelect("판타지")}>🧙‍♂️ 판타지</button>
              <button onClick={() => handleAvoidSelect("애니메이션")}>🎨 애니메이션</button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h3>어느 국적의 영화를 선호하시나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleOriginSelect("한국")}>🇰🇷 한국 영화</button>
              <button onClick={() => handleOriginSelect("동아시아")}>🌏 동아시아 영화<br /><small>(일본, 대만, 중국 등)</small></button>
              <button onClick={() => handleOriginSelect("서구권")}>🎬 서구권 영화<br /><small>(미국, 유럽 등)</small></button>
              <button onClick={() => handleOriginSelect("기타")}>🏆 기타 국가<br /><small>(인도, 남미, 중동 등)</small></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;
