import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaUndo, FaRedo, FaHeart, FaDownload, FaArrowLeft, FaCamera, FaVideo, FaStop } from 'react-icons/fa';
import axios from 'axios';

const EditorContainer = styled.div`
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: white;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const EditorTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const EditorContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  height: calc(100vh - 200px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const CanvasContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  /* 휠 스크롤 차단 */
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  border: 2px dashed #ddd;
  border-radius: 10px;
  cursor: crosshair;
  
  /* 휠 스크롤 차단 */
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
`;

const ControlsPanel = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const ControlSection = styled.div`
  margin-bottom: 30px;
`;

const ControlTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
`;

const ControlGroup = styled.div`
  margin-bottom: 15px;
`;

const ControlLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
`;

const ControlInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ControlButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  }

  &.secondary {
    background: #f8f9fa;
    color: #333;
    border: 2px solid #e1e5e9;

    &:hover {
      background: #e9ecef;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Dropzone = styled.div`
  border: 2px dashed #667eea;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  background: rgba(102, 126, 234, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #764ba2;
  }
`;

const DropzoneIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 15px;
`;

const DropzoneText = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const DropzoneSubtext = styled.p`
  color: #999;
  font-size: 0.9rem;
`;

const HairStyleInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const HairStyleName = styled.h4`
  margin-bottom: 10px;
  color: #333;
`;

const HairStyleImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
`;

// 웹캠 관련 스타일 컴포넌트들
const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
  border-radius: 10px;
  transform: scaleX(-1); // 거울 효과 (선택사항)
`;

const CameraControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 10;
`;

const CameraButton = styled.button`
  background: ${props => props.isActive ? '#e74c3c' : 'rgba(255, 255, 255, 0.8)'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
`;

const UploadMethodSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const MethodButton = styled.button`
  flex: 1;
  padding: 12px;
  border: 2px solid ${props => props.isActive ? '#667eea' : '#e1e5e9'};
  border-radius: 8px;
  background: ${props => props.isActive ? '#667eea' : 'white'};
  color: ${props => props.isActive ? 'white' : '#333'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: #667eea;
    background: ${props => props.isActive ? '#667eea' : '#f8f9fa'};
  }
`;

const SynthesisEditor = () => {
  const { hairStyleId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [hairStyle, setHairStyle] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [adjustments, setAdjustments] = useState({
    position: { x: 0, y: 0 },
    scale: { x: 1, y: 1 },
    rotation: 0,
    opacity: 1
  });
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [synthesisId, setSynthesisId] = useState(null);
  
  // 웹캠 관련 상태
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' 또는 'camera'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    fetchHairStyle();
  }, [hairStyleId]);

  const fetchHairStyle = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/hair-styles/${hairStyleId}`);
      setHairStyle(response.data);
    } catch (error) {
      console.error('헤어스타일을 불러오는데 실패했습니다:', error);
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        drawCanvas();
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        // 캔버스 크기에 맞게 이미지 그리기
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // 헤어스타일 합성 (실제로는 더 복잡한 로직이 필요)
        if (hairStyle) {
          const hairImg = new Image();
          hairImg.onload = () => {
            ctx.save();
            ctx.globalAlpha = adjustments.opacity;
            ctx.translate(
              canvas.width / 2 + adjustments.position.x,
              canvas.height / 2 + adjustments.position.y
            );
            ctx.rotate((adjustments.rotation * Math.PI) / 180);
            ctx.scale(adjustments.scale.x, adjustments.scale.y);
            ctx.drawImage(
              hairImg,
              -hairImg.width / 2,
              -hairImg.height / 2,
              hairImg.width,
              hairImg.height
            );
            ctx.restore();
          };
          hairImg.src = hairStyle.imageUrl;
        }
      };
      img.src = uploadedImage;
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [uploadedImage, adjustments, hairStyle]);

  const handleAdjustmentChange = (type, value) => {
    setAdjustments(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleLike = async () => {
    if (!uploadedImage) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    setLoading(true);
    try {
      if (!synthesisId) {
        // 합성 생성 후 좋아요
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);

        const formData = new FormData();
        const blob = await fetch(dataURL).then(r => r.blob());
        formData.append('originalImage', blob, 'image.jpg');
        formData.append('hairStyleId', hairStyleId);
        formData.append('adjustments', JSON.stringify(adjustments));

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/synthesis`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        setSynthesisId(response.data.synthesis._id);

        // 합성 생성 후 바로 좋아요 추가
        await axios.post(`${process.env.REACT_APP_API_URL}/api/synthesis/${response.data.synthesis._id}/like`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setIsLiked(true);
        alert('좋아요가 추가되었습니다!');
      } else {
        // 좋아요 토글
        await axios.post(`${process.env.REACT_APP_API_URL}/api/synthesis/${synthesisId}/like`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setIsLiked(!isLiked);
        alert(isLiked ? '좋아요가 취소되었습니다.' : '좋아요가 추가되었습니다!');
      }
    } catch (error) {
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'hair-synthesis.jpg';
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetAdjustments = () => {
    setAdjustments({
      position: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
      rotation: 0,
      opacity: 1
    });
  };

  // 드래그 시작
  const handleMouseDown = (e) => {
    if (!uploadedImage) return;
    setIsDragging(true);
    setDragStart({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setInitialPosition({ ...adjustments.position });
  };

  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.nativeEvent.offsetX - dragStart.x;
    const dy = e.nativeEvent.offsetY - dragStart.y;
    setAdjustments((prev) => ({
      ...prev,
      position: {
        x: initialPosition.x + dx,
        y: initialPosition.y + dy,
      },
    }));
  };

  // 드래그 끝
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 휠로 크기 조정
  const handleWheel = (e) => {
    if (!uploadedImage) return;
    e.preventDefault();
    e.stopPropagation();
    const scaleStep = 0.05;
    let newScale = adjustments.scale.x + (e.deltaY < 0 ? scaleStep : -scaleStep);
    newScale = Math.max(0.1, Math.min(3, newScale));
    setAdjustments((prev) => ({
      ...prev,
      scale: { x: newScale, y: newScale },
    }));
  };

  // 캔버스 컨테이너에서 휠 이벤트 차단
  const handleContainerWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // 웹캠 시작 함수 수정
  const startCamera = async () => {
    try {
      console.log('웹캠 시작 시도...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' // 전면 카메라
        } 
      });
      
      console.log('웹캠 스트림 획득 성공:', mediaStream);
      
      // 상태 먼저 업데이트
      setStream(mediaStream);
      setIsCameraActive(true);
      
      // 비디오 요소가 렌더링된 후 스트림 연결
      setTimeout(() => {
        if (videoRef.current) {
          console.log('비디오 요소 찾음:', videoRef.current);
          videoRef.current.srcObject = mediaStream;
          console.log('srcObject 설정 완료:', videoRef.current.srcObject);
          
          // 비디오 로드 완료 후 재생
          videoRef.current.onloadedmetadata = () => {
            console.log('비디오 메타데이터 로드 완료');
            videoRef.current.play().then(() => {
              console.log('비디오 재생 시작');
            }).catch(err => {
              console.error('비디오 재생 실패:', err);
            });
          };
          
          // 추가: 비디오 이벤트 리스너
          videoRef.current.oncanplay = () => {
            console.log('비디오 재생 준비 완료');
          };
          
          videoRef.current.onerror = (error) => {
            console.error('비디오 오류:', error);
          };
        } else {
          console.error('비디오 요소를 찾을 수 없습니다');
        }
      }, 100); // 100ms 지연
      
    } catch (error) {
      console.error('웹캠 접근 실패:', error);
      if (error.name === 'NotAllowedError') {
        alert('웹캠 접근이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.');
      } else if (error.name === 'NotFoundError') {
        alert('웹캠을 찾을 수 없습니다. 웹캠이 연결되어 있는지 확인해주세요.');
      } else {
        alert('웹캠에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  };

  // 웹캠 중지
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // 웹캠에서 사진 촬영
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    setUploadedImage(dataURL);
    stopCamera();
    setUploadMethod('file');
    drawCanvas();
  };

  // 컴포넌트 언마운트 시 웹캠 정리
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // 웹캠 상태 확인
  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      console.log('웹캠 활성화됨');
      console.log('비디오 요소:', videoRef.current);
      console.log('비디오 srcObject:', videoRef.current.srcObject);
    }
  }, [isCameraActive]);

  // 캔버스 컨테이너에만 휠 이벤트 리스너 추가 (캔버스는 제외)
  useEffect(() => {
    const container = document.querySelector('.canvas-container');
    
    const wheelHandler = (e) => {
      // 캔버스 영역이 아닌 경우에만 이벤트 차단
      const canvas = canvasRef.current;
      if (canvas && (e.target === canvas || canvas.contains(e.target))) {
        return; // 캔버스에서는 이벤트를 허용
      }
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };
    
    if (container) {
      container.addEventListener('wheel', wheelHandler, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', wheelHandler);
      }
    };
  }, [uploadedImage]); // uploadedImage가 변경될 때마다 다시 등록

  if (!hairStyle) {
    return <div>로딩 중...</div>;
  }

  return (
    <EditorContainer>
      <EditorHeader>
        <BackButton onClick={() => navigate('/hair-styles')}>
          <FaArrowLeft />
          뒤로 가기
        </BackButton>
        <EditorTitle>헤어 합성 에디터</EditorTitle>
        <div></div>
      </EditorHeader>

      <EditorContent>
        <CanvasContainer className="canvas-container" onWheel={handleContainerWheel}>
          {!uploadedImage ? (
            <div>
              <UploadMethodSelector>
                <MethodButton
                  isActive={uploadMethod === 'file'}
                  onClick={() => setUploadMethod('file')}
                >
                  <FaUpload />
                  파일 업로드
                </MethodButton>
                <MethodButton
                  isActive={uploadMethod === 'camera'}
                  onClick={() => setUploadMethod('camera')}
                >
                  <FaCamera />
                  웹캠 촬영
                </MethodButton>
              </UploadMethodSelector>

              {uploadMethod === 'file' ? (
                <Dropzone {...getRootProps()}>
                  <input {...getInputProps()} />
                  <DropzoneIcon>
                    <FaUpload />
                  </DropzoneIcon>
                  <DropzoneText>
                    {isDragActive
                      ? '여기에 이미지를 놓으세요'
                      : '클릭하거나 이미지를 드래그하여 업로드하세요'}
                  </DropzoneText>
                  <DropzoneSubtext>
                    JPG, PNG, GIF 파일을 지원합니다
                  </DropzoneSubtext>
                </Dropzone>
              ) : (
                <CameraContainer>
                  {isCameraActive ? (
                    <>
                      <Video ref={videoRef} autoPlay playsInline />
                      <CameraControls>
                        <CameraButton onClick={capturePhoto} title="사진 촬영">
                          <FaCamera />
                        </CameraButton>
                        <CameraButton onClick={stopCamera} title="웹캠 중지">
                          <FaStop />
                        </CameraButton>
                      </CameraControls>
                    </>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <FaCamera style={{ fontSize: '4rem', marginBottom: '20px' }} />
                      <h3>웹캠을 시작하세요</h3>
                      <p>웹캠에서 사진을 촬영하여 합성할 수 있습니다</p>
                      <CameraButton 
                        onClick={startCamera} 
                        style={{ marginTop: '20px' }}
                        title="웹캠 시작"
                      >
                        <FaVideo />
                      </CameraButton>
                    </div>
                  )}
                </CameraContainer>
              )}
            </div>
          ) : (
            <Canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            />
          )}
        </CanvasContainer>

        <ControlsPanel>
          <HairStyleInfo>
            <HairStyleName>{hairStyle.name}</HairStyleName>
            <HairStyleImage src={hairStyle.imageUrl} alt={hairStyle.name} />
          </HairStyleInfo>

          <ControlSection>
            <ControlTitle>위치 조정</ControlTitle>
            <ControlGroup>
              <ControlLabel>X 위치</ControlLabel>
              <ControlInput
                type="range"
                min="-200"
                max="200"
                value={adjustments.position.x}
                onChange={(e) => handleAdjustmentChange('position', {
                  ...adjustments.position,
                  x: parseInt(e.target.value)
                })}
              />
            </ControlGroup>
            <ControlGroup>
              <ControlLabel>Y 위치</ControlLabel>
              <ControlInput
                type="range"
                min="-200"
                max="200"
                value={adjustments.position.y}
                onChange={(e) => handleAdjustmentChange('position', {
                  ...adjustments.position,
                  y: parseInt(e.target.value)
                })}
              />
            </ControlGroup>
          </ControlSection>

          <ControlSection>
            <ControlTitle>크기 조정</ControlTitle>
            <ControlGroup>
              <ControlLabel>X 크기</ControlLabel>
              <ControlInput
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={adjustments.scale.x}
                onChange={(e) => handleAdjustmentChange('scale', {
                  ...adjustments.scale,
                  x: parseFloat(e.target.value)
                })}
              />
            </ControlGroup>
            <ControlGroup>
              <ControlLabel>Y 크기</ControlLabel>
              <ControlInput
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={adjustments.scale.y}
                onChange={(e) => handleAdjustmentChange('scale', {
                  ...adjustments.scale,
                  y: parseFloat(e.target.value)
                })}
              />
            </ControlGroup>
          </ControlSection>

          <ControlSection>
            <ControlTitle>회전 및 투명도</ControlTitle>
            <ControlGroup>
              <ControlLabel>회전</ControlLabel>
              <ControlInput
                type="range"
                min="-180"
                max="180"
                value={adjustments.rotation}
                onChange={(e) => handleAdjustmentChange('rotation', parseInt(e.target.value))}
              />
            </ControlGroup>
            <ControlGroup>
              <ControlLabel>투명도</ControlLabel>
              <ControlInput
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={adjustments.opacity}
                onChange={(e) => handleAdjustmentChange('opacity', parseFloat(e.target.value))}
              />
            </ControlGroup>
          </ControlSection>

          <ControlSection>
            <ControlButton
              className="secondary"
              onClick={resetAdjustments}
            >
              <FaUndo />
              초기화
            </ControlButton>
            <ControlButton
              className="primary"
              onClick={handleDownload}
              disabled={!uploadedImage}
            >
              <FaDownload />
              다운로드
            </ControlButton>
            <ControlButton
              className="primary"
              onClick={handleLike}
              disabled={!uploadedImage || loading}
            >
              <FaHeart />
              {loading ? '처리 중...' : (isLiked ? '좋아요 취소' : '좋아요')}
            </ControlButton>
          </ControlSection>
        </ControlsPanel>
      </EditorContent>
    </EditorContainer>
  );
};

export default SynthesisEditor; 