# EduQR - 교육 출석 체크 QR 코드 생성기

어떤 PC에서나 사용할 수 있고, 스마트폰에서도 인터넷만 연결되어 있으면 접근 가능한 QR 코드 생성기입니다.

## 기능

- 교육명과 입력 항목(이름, 소속, 연락처 등)을 설정하여 QR 코드 생성
- 생성된 QR 코드를 스캔하면 교육명과 입력 필드가 있는 화면 표시
- 인터넷이 연결된 어디서나 접근 가능 (같은 Wi-Fi 필요 없음)

## 배포 방법

### 방법 1: GitHub Pages (추천)

1. GitHub에 새 저장소 생성
2. 이 폴더의 모든 파일을 업로드
3. 저장소 Settings → Pages로 이동
4. Source를 "main" 브랜치의 "/ (root)"로 설정
5. 저장 후 몇 분 후 `https://[사용자명].github.io/[저장소명]/index.html` 접속

### 방법 2: Netlify Drop

1. [Netlify Drop](https://app.netlify.com/drop) 접속
2. 이 폴더를 드래그 앤 드롭
3. 자동으로 배포되어 URL 제공

### 방법 3: Vercel

1. [Vercel](https://vercel.com) 가입
2. "Add New Project" 클릭
3. 이 폴더를 업로드하거나 GitHub 저장소 연결
4. 자동 배포

### 방법 4: 로컬 서버 (개발용)

```bash
cd Cursor/EduQR
python -m http.server 8000
```

그 후 브라우저에서 `http://localhost:8000/index.html` 접속

## 사용 방법

1. 배포된 페이지에 접속
2. "QR만들기" 버튼 클릭
3. 교육명 입력
4. "기본 필드 추가" 버튼으로 이름/소속/연락처 추가하거나
   "+ 항목 추가"로 원하는 항목 직접 추가
5. 각 항목의 이름(질문) 입력
6. "QR 생성" 버튼 클릭
7. 생성된 QR 코드를 스캔하면 입력 화면이 표시됨

## 파일 구조

- `index.html` - QR 코드 생성 페이지
- `survey.html` - QR 코드 스캔 시 표시되는 입력 페이지
- `script.js` - QR 생성 로직
- `survey.js` - 입력 페이지 로직
- `style.css` - 스타일시트

## 주의사항

- 인터넷 연결이 필요합니다
- 생성된 QR 코드는 해당 페이지가 호스팅된 주소를 사용합니다
- 데이터는 URL 파라미터로 전달되므로 매우 긴 URL이 생성될 수 있습니다

