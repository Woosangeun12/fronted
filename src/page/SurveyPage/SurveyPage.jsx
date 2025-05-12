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
  const [tone,setTone] =  useState('');

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

  const handleOriginSelect = (selectedOrigin) => {
    console.log(`국가: ${selectedOrigin}`);
    setOrigin(selectedOrigin);
    setStep(6);
  };  
  

  const handleMindSelect = async (selectedTone) => { 
    const visitorId = sessionStorage.getItem('visitorId');
    const surveyResult = {
      emotion: feeling,
      style: style,
      genre: preferredGenre,
      origin: origin,
      hate: hate,
    };
  
    if (!visitorId || !feeling || !style || !preferredGenre || !origin || !hate || !selectedTone) {
      alert("모든 항목을 선택해 주세요.");
      return;
    }
  
    console.log("visitorId:", visitorId);
    console.log("보내는 데이터:", surveyResult);
    console.log("origin:", origin); 
    console.log("보내는 tone:", selectedTone);

    setTone(selectedTone);
    sessionStorage.setItem("emotion", feeling);
    sessionStorage.setItem("style", style);
    sessionStorage.setItem("tone", selectedTone);

  
    try {
      const res = await api.post(`/api/recommend/${visitorId}`, surveyResult);
      sessionStorage.setItem("recommendedMovies", JSON.stringify(res.data));
      alert(`${nickname}님의 설문이 완료되었습니다! 🎉\n\n👉 추천 결과를 준비할게요!`);
      navigate('/recommend');
    } catch (error) {
      console.error('설문 저장 실패:', error.response?.data || error.message);
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
              <button onClick={() => handleFeeling("슬픔")} className="feeling-btn">😢 우울해</button>
              <button onClick={() => handleFeeling("행복")} className="feeling-btn">😊 기분 좋아</button>
              <button onClick={() => handleFeeling("지루함")} className="feeling-btn">😐 지루해</button>
              <button onClick={() => handleFeeling("스트레스")} className="feeling-btn">🤯 스트레스 받아</button>
            </div>
          </>
        )}

        {step === 2 && feeling === '슬픔' && (
          <>
            <h3>우울하거나 슬플 때, 당신은 그 감정을 어떻게 달래나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleResponse("기분전환")}>🏃 산책이나 가벼운 운동<br /></button>
              <button onClick={() => handleResponse("위로")}>👪 친구나 가족과 대화<br /></button>
              <button onClick={() => handleResponse("몰입감")}>📚 책이나 영화에 몰입<br /></button>
              <button onClick={() => handleResponse("웃긴")}>😂 유머와 코미디 즐기기<br /></button>
            </div>
          </>
        )}

        {step === 2 && feeling === '행복' && (
          <>
            <h3>행복하거나 기쁠 때, 그 긍정적인 감정을 어떻게 유지하거나 증폭시키시나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleResponse("기분전환")}>✨ 새로운 경험에 도전하기<br /><small>– 기분을 더욱 고조시키기</small></button>
              <button onClick={() => handleResponse("위로")}>👨‍👩‍👧‍👦 사람들과 시간 보내기<br /><small>– 안정감과 위로</small></button>
              <button onClick={() => handleResponse("몰입감")}>🎨 좋아하는 일 몰입<br /><small>– 집중과 즐거움</small></button>
              <button onClick={() => handleResponse("웃긴")}>😂 유머 콘텐츠 즐기기<br /><small>– 웃음으로 긍정 유지</small></button>
            </div>
          </>
        )}

        {step === 2 && feeling === '스트레스' && (
          <>
            <h3>스트레스나 불안을 느낄 때, 당신은 그 감정을 어떻게 해소하나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleResponse("기분전환")}>🏃 짧은 산책이나 운동<br /><small>– 신체 활동으로 긴장 해소</small></button>
              <button onClick={() => handleResponse("위로")}>🧘 명상이나 조용한 시간<br /><small>– 내면의 평화</small></button>
              <button onClick={() => handleResponse("몰입감")}>🎬 몰입할 콘텐츠 보기<br /><small>– 불안 잊기</small></button>
              <button onClick={() => handleResponse("웃긴")}>😄 친구와 웃는 대화<br /><small>– 즐거움으로 스트레스 날리기</small></button>
            </div>
          </>
        )}

        {step === 2 && feeling === '지루함' && (
          <>
            <h3>지루하거나 무기력할 때, 당신은 그 상태를 어떻게 극복하시나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleResponse("기분전환")}>🚴 새로운 활동에 도전하기<br /><small>– 일상 탈피로 기분 전환</small></button>
              <button onClick={() => handleResponse("위로")}>🎥 감동적인 이야기 보기<br /><small>– 감정 자극으로 에너지 얻기</small></button>
              <button onClick={() => handleResponse("몰입감")}>🎯 취미나 프로젝트 참여<br /><small>– 몰입으로 무기력 해소</small></button>
              <button onClick={() => handleResponse("웃긴")}>🤣 유쾌한 코미디 보기<br /><small>– 웃음으로 지루함 날리기</small></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3>어떤 장르의 영화를 좋아하나요?</h3>
            <div className="genre-button-group">
              <div className="genre-row">
                <button onClick={() => handleGenreSelect("로맨스")}>💕 로맨스</button>
                <button onClick={() => handleGenreSelect("코미디")}>😂 코미디</button>
              </div>
              <div className="genre-row">
                <button onClick={() => handleGenreSelect("애니메이션")}>🎨 애니메이션</button>
                <button onClick={() => handleGenreSelect("드라마")}>🎭 드라마</button>
              </div>
              <div className="genre-row">
                <button onClick={() => handleGenreSelect("액션")}>💥 액션</button>
                <button onClick={() => handleGenreSelect("스릴러")}>🔪 스릴러</button>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3>피하고 싶은 영화 장르가 있다면 알려주세요</h3>
            <div className="genre-button-group">
              <div className="genre-row">
                <button onClick={() => handleAvoidSelect("로맨스")}>💕 로맨스</button>
                <button onClick={() => handleAvoidSelect("코미디")}>😂 코미디</button>
              </div>
              <div className="genre-row">
                <button onClick={() => handleAvoidSelect("애니메이션")}>🎨 애니메이션</button>
                <button onClick={() => handleAvoidSelect("드라마")}>🎭 드라마</button>
              </div>
              <div className="genre-row">
                <button onClick={() => handleAvoidSelect("액션")}>💥 액션</button>
                <button onClick={() => handleAvoidSelect("스릴러")}>🔪 스릴러</button>
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h3>어느 국적의 영화를 선호하시나요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleOriginSelect("한국")}>🇰🇷 한국 영화</button>
              <button onClick={() => handleOriginSelect("동아시아")}>🌏 동아시아 영화<br /><small>(일본, 대만, 중국 등)</small></button>
              <button onClick={() => handleOriginSelect("서구")}>🎬 서구권 영화<br /><small>(미국, 영국 등)</small></button>
              <button onClick={() => handleOriginSelect("기타")}>🏆 기타 국가<br /><small>(유럽, 인도 등)</small></button>
            </div>
          </>
        )}
        {step === 6 && (
          <>
            <h3>지금 당신에게 가장 필요한 건 어떤 말인가요?</h3>
            <div className="feeling-buttons">
              <button onClick={() => handleMindSelect("위로")}>💬 위로</button>
              <button onClick={() => handleMindSelect("동기부여")}>🔥 동기부여</button>
              <button onClick={() => handleMindSelect("조언")}>💡 조언</button>
              <button onClick={() => handleMindSelect("응원")}>🙌 응원</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;
