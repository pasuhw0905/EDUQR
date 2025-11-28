(function () {
  /** @type {HTMLButtonElement} */
  const makeQrBtn = document.getElementById('makeQrBtn');
  /** @type {HTMLElement} */
  const builder = document.getElementById('builder');
  /** @type {HTMLDivElement} */
  const questionsContainer = document.getElementById('questionsContainer');
  /** @type {HTMLButtonElement} */
  const addQuestionBtn = document.getElementById('addQuestionBtn');
  /** @type {HTMLInputElement} */
  const programNameInput = document.getElementById('programName');
  /** @type {HTMLButtonElement} */
  const generateBtn = document.getElementById('generateBtn');
  /** @type {HTMLImageElement} */
  const qrImage = document.getElementById('qrImage');
  /** @type {HTMLAnchorElement} */
  const surveyLink = document.getElementById('surveyLink');
  /** @type {HTMLElement} */
  const qrResult = document.getElementById('qrResult');

  let questionIdCounter = 0;
  /** @type {{id:number, question:string, answer:string}[]} */
  let qaItems = [];

  function toggleBuilder(show) {
    if (show) {
      builder.classList.remove('hidden');
      builder.setAttribute('aria-hidden', 'false');
    } else {
      builder.classList.add('hidden');
      builder.setAttribute('aria-hidden', 'true');
    }
  }

  function toggleQrResult(show) {
    if (!qrResult) return;
    if (show) {
      qrResult.classList.remove('hidden');
      qrResult.setAttribute('aria-hidden', 'false');
    } else {
      qrResult.classList.add('hidden');
      qrResult.setAttribute('aria-hidden', 'true');
    }
  }

  function createQuestionItem(data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'q-item';
    wrapper.dataset.id = String(data.id);

    const questionInput = document.createElement('input');
    questionInput.className = 'input';
    questionInput.type = 'text';
    questionInput.placeholder = '항목명을 입력하세요 (예: 이름, 소속, 연락처)';
    questionInput.value = data.question;

    const answerInput = document.createElement('input');
    answerInput.className = 'input';
    answerInput.type = 'text';
    answerInput.placeholder = '예상 답변 또는 옵션(선택)';
    answerInput.value = data.answer;

    const controls = document.createElement('div');
    controls.className = 'q-controls';

    const indexBadge = document.createElement('span');
    indexBadge.className = 'index';
    indexBadge.textContent = String(questionsContainer.children.length + 1);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'icon-btn remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = '삭제';

    removeBtn.addEventListener('click', () => {
      const id = data.id;
      qaItems = qaItems.filter(item => item.id !== id);
      const el = questionsContainer.querySelector(`[data-id="${id}"]`);
      if (el) el.remove();
      updateIndexes();
    });

    questionInput.addEventListener('input', (e) => {
      data.question = e.target.value;
    });
    answerInput.addEventListener('input', (e) => {
      data.answer = e.target.value;
    });

    controls.appendChild(indexBadge);
    controls.appendChild(removeBtn);

    wrapper.appendChild(questionInput);
    wrapper.appendChild(answerInput);
    wrapper.appendChild(controls);

    return wrapper;
  }

  function updateIndexes() {
    const items = Array.from(questionsContainer.children);
    items.forEach((el, i) => {
      const badge = el.querySelector('.index');
      if (badge) badge.textContent = String(i + 1);
    });
  }

  function addQuestion(question = '', answer = '') {
    const item = { id: ++questionIdCounter, question, answer };
    qaItems.push(item);
    const node = createQuestionItem(item);
    questionsContainer.appendChild(node);
    updateIndexes();
  }

  function addDefaultFields() {
    // 기존 기본 필드가 있는지 확인
    const hasName = qaItems.some(item => item.question === '이름');
    const hasOrg = qaItems.some(item => item.question === '소속');
    const hasContact = qaItems.some(item => item.question === '연락처');
    
    if (!hasName) addQuestion('이름', '');
    if (!hasOrg) addQuestion('소속', '');
    if (!hasContact) addQuestion('연락처', '');
  }

  function ensureAtLeastThree() {
    while (qaItems.length < 3) addQuestion('', '');
  }

  function initializeDefaultState() {
    qaItems = [];
    questionsContainer.innerHTML = '';
    ensureAtLeastThree();
    toggleQrResult(false);
  }

  function encodeData(obj) {
    const json = JSON.stringify(obj);
    const uri = encodeURIComponent(json);
    return btoa(uri);
  }

  function buildSurveyUrl(payload) {
    // 현재 페이지의 origin을 사용 (어디서 호스팅되든 자동으로 작동)
    // index.html이 있는 디렉토리를 기준으로 survey.html 경로 생성
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    const baseUrl = window.location.origin + basePath;
    const base = new URL('survey.html', baseUrl);
    const data = encodeData(payload);
    base.searchParams.set('data', data);
    return base.toString();
  }

  function buildQrImageUrl(targetUrl) {
    const encoded = encodeURIComponent(targetUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encoded}`;
  }

  /** @type {HTMLButtonElement} */
  const addDefaultFieldsBtn = document.getElementById('addDefaultFieldsBtn');

  makeQrBtn.addEventListener('click', () => {
    toggleBuilder(true);
    if (qaItems.length === 0) {
      qaItems = [];
      questionsContainer.innerHTML = '';
      questionIdCounter = 0;
    }
    toggleQrResult(false);
  });

  if (addDefaultFieldsBtn) {
    addDefaultFieldsBtn.addEventListener('click', () => {
      addDefaultFields();
    });
  }

  addQuestionBtn.addEventListener('click', () => addQuestion('', ''));

  generateBtn.addEventListener('click', () => {
    const programName = (programNameInput.value || '').trim();
    const payload = {
      programName,
      questions: qaItems.map(({ id, question }) => ({ question }))
    };
    const surveyUrl = buildSurveyUrl(payload);
    const qrUrl = buildQrImageUrl(surveyUrl);

    if (qrImage) qrImage.src = qrUrl;
    if (surveyLink) surveyLink.href = surveyUrl;
    toggleQrResult(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
})(); 