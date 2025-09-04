# 🎯 Slid to-do


`Slid to-do`는 다양한 학습 및 작업 콘텐츠(아티클, 강의 영상, Zoom 미팅 일정, 강의 자료 등)를 할 일 목록으로 정리하고, 각 콘텐츠에 대한 노트를 작성하며 체계적으로 학습과 프로젝트를 관리할 수 있는 서비스입니다.

- 📅 프로젝트 기간: 2025.07.03 ~ 2025.08.12 (총 6주)
- 😄 팀원: 5명

| 배포 사이트 |                                    💻 [배포 링크](https://slid-to-do-fe.vercel.app/)                                     |
| :-------: | :---- |
|   공용 문서 노션    | 💻 [Notion 링크](https://mewing-halloumi-584.notion.site/Team-7-Project-Workspace-22261be3ce85802badebf9804fd30fdd?pvs=74) |

### 📝 이런 기능들이 있어요

- 할 일/목표/노트 페이지 리스트 조회
- 목표 및 할 일 등록·수정·삭제·완료 체크 및 필터링
- 다양한 콘텐츠 유형 등록 (파일, 링크 등)
- 할 일별 노트 작성 및 관리
- 할 일 진행률 시각화
- 반응형 UI + 애니메이션 구현


## 🤝🏻 Team Slid to-do

| <img width="268" alt="Image" src="https://github.com/user-attachments/assets/e73b4f54-fd73-46ba-ac71-22bee63dfae1" /> | <img width="268" alt="Image" src="https://github.com/user-attachments/assets/293f6f22-4d36-420a-979a-be79dc86d6d6" /> | <img width="268" alt="Image" src="https://github.com/user-attachments/assets/53b9b249-a2cc-49bc-9979-a39492874504" /> | <img width="268" alt="Image" src="https://github.com/user-attachments/assets/fb2046a9-e8a9-420a-a011-181ff6f33fcd" /> | <img width="268" alt="Image" src="https://github.com/user-attachments/assets/b8da23a4-6a04-492d-9efd-53a524f945d7" /> |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **윤예지(팀장)**                                                                                                      | **임민규**                                                                                                            | **노주영**                                                                                                            | **정유하**                                                                                                            | **박솔미**                                                                                                            |
| - 노트 모아보기/수정 페이지<br /> - 공통 훅·컴포넌트 개발                                                             | - 대시보드<br />- 사이드바<br />- 로그인/토큰 재발급/로그아웃<br />- 전역 스타일 개발                                 | - 할 일 페이지<br />- 할 일 생성모달<br />- 모달 커스텀 훅<br /> - 공통 컴포넌트 개발                                 | - 목표 페이지<br />- 노트 작성 페이지<br />- 무한스크롤 훅<br />- 공통 컴포넌트 개발                                  | - 로그인/회원가입 페이지<br />- 커스텀 훅<br />- 공통 컴포넌트 개발                                                   |

<br/>

## 💻 Slid to-do 페이지

<table>	
	<tr>
			</tr>
 <tr>
    <th>
      회원 가입 페이지
    </th>
    <th>
      로그인 페이지
    </th>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/e2f27a3b-dd1f-4d93-8fde-0a06c7f77c3e"  alt="signup page" width = 100% >
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/59b0c486-d46f-4369-8239-465c302a6eb4" alt="login page" width = 100%>
    </td>
   </tr> 
  <tr>
    <th>
      메인 페이지 - (대시보드)
    </th>
    <th>
      모든 할 일 페이지
    </th>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/f5d6b998-ae2f-4f18-88d5-4303bbb7a2a1"  alt="main page" width = 100%>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/1ad1a771-f499-48a7-8ef4-4e79c7af856c" alt="add page" width = 100%>
    </td>
   </tr>
   <tr>
    <th>
      할 일 생성 모달 
    </th> 
    <th>
      목표 페이지
    </th>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/194cab65-63ee-4e35-b704-a047ff466f1d" alt="list page" width = 100%>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/fd978c34-d7f2-4c57-9358-560732f1ca27" alt="review page" width = 100%>
    </td>
  </tr> 
  <tr>
   <th>
      노트 모아보기
    </th>  <th>
      노트 작성
    </th>
  </tr>
  <tr>  
	<td>
      <img src="https://github.com/user-attachments/assets/3e0c74ca-2b44-493c-94da-117ba9fc8c63" alt="mypage" width = 100%>
	</td>
	    <td>
      <img src="https://github.com/user-attachments/assets/bc02cb33-e978-4d26-af8c-ecbe7cdc42c1" alt="review page" width = 100%>
    </td>
  </tr>
      <br/>
</table>	

<br/>

## ⚒️ 프로젝트 구조 / 스킬 / 팀 컨벤션


### 📦 디렉토리 구조

```
📦 slid-to-do
├─ app/
│  ├─ api/             # # Next.js API Routes
│	 ├─ dashboard/       # 대시보드 페이지
│	 ├─ goals/           # 목표 페이지
│	 ├─ login/           # 로그인 페이지
│	 ├─ notes/           # 노트 페이지
│	 ├─ providers/       # 전역 공통 기능 Provider 모음
│  ├─ signup/          # 회원가입 페이지
│	 ├─ todos/           # 할 일 페이지
│	 ├─ layout.tsx       # 공통 레이아웃
│  └─ page.tsx         # 메인 페이지
├─ components/         # UI 컴포넌트 모음
├─ hooks/              # 커스텀 훅
├─ lib/                # api 통신 관련 로직
├─ store/              # Zustand 전역 상태
├─ types/              # 타입 모음
├─ utils/              # 공통 유틸 함수
├─ middleware.ts       # 모든 요청에 대해 사전 처리(인증, 리다이렉트 등) 수행
└─ public/             # 정적 리소스
```


### 📐 사용 기술 및 팀 컨벤션

- 팀 협업 컨벤션 : [컨벤션 Readme](https://github.com/slid-to-do/slid-to-do-fe/blob/develop/CONVENTION.md)

<table>

  <tr>
    <td align="center"><b>프레임워크/언어</b></td>
    <td>
      <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
      <img src="https://img.shields.io/badge/TypeScript-007acc?style=for-the-badge&logo=typescript&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>상태관리/데이터</b></td>
    <td>
      <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
      <img src="https://img.shields.io/badge/Zustand-4B32C3?style=for-the-badge&logo=react&logoColor=white" />
      <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>UI/애니메이션</b></td>
    <td>
      <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
      <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
      <img src="https://img.shields.io/badge/TipTap-9747FF?style=for-the-badge&logo=tiptap&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>테스트</b></td>
    <td>
      <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
      <img src="https://img.shields.io/badge/React_Testing_Library-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>협업/버전관리</b></td>
    <td>
      <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
      <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white" />
      <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
      <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
    </td>
  </tr>
</table>

<br/>


## 🗒️ 팀 회고

<img width="793" alt="Image" src="https://github.com/user-attachments/assets/58820917-6d07-4d59-ba49-368188488245" />
