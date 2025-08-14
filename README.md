# 🎯 Slid to-do

![Slid to-do](https://private-user-images.githubusercontent.com/104883910/476993685-8dbfd81f-b61c-41be-acb2-7db92c9af8dd.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTQ5OTI3ODUsIm5iZiI6MTc1NDk5MjQ4NSwicGF0aCI6Ii8xMDQ4ODM5MTAvNDc2OTkzNjg1LThkYmZkODFmLWI2MWMtNDFiZS1hY2IyLTdkYjkyYzlhZjhkZC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwODEyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDgxMlQwOTU0NDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mZGVmMzBiZmYwM2ViZjkzNDlmNTk1OTAxYzUzYzk0MzNiZTU5YTJiNTQzZjBhZmQ1YTY0OWM2NGMzYTZlMjY0JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.51jVuBeF72xZLwf9e6e7kyrhiOiKq05WEsq0R5twYpA)

## 🔗 배포 링크

https://slid-to-do-fe.vercel.app/

## 💡 Slid to-do는

`Slid to-do`는 다양한 학습 및 작업 콘텐츠(아티클, 강의 영상, Zoom 미팅 일정, 강의 자료 등)를 할 일 목록으로 정리하고, 각 콘텐츠에 대한 노트를 작성하며 체계적으로 학습과 프로젝트를 관리할 수 있는 서비스입니다.

## 📝 이런 기능들이 있어요

- 할 일/목표/노트 페이지 리스트 조회
- 목표 및 할 일 등록·수정·삭제·완료 체크 및 필터링
- 다양한 콘텐츠 유형 등록 (파일, 링크 등)
- 할 일별 노트 작성 및 관리
- 할 일 진행률 시각화
- 반응형 UI + 애니메이션 구현

## 📦 프로젝트 구조

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

## ⚒️ 사용 기술

| 구분            | 내용                                   |
| --------------- | -------------------------------------- |
| 프레임워크/언어 | Next.js(15, app-router), TypeScript    |
| 상태관리/데이터 | React-Query(5), Zustand(5), Axios      |
| UI/애니메이션   | Tailwind CSS(4), Framer Motion, TipTap |
| 테스트          | Jest, React Testing Library            |
| 협업/버전관리   | Git, Notion, Swagger, Figma            |

## 📅 팀 프로젝트 기간

2025.07.03 ~ 2025.08.12 (총 6주)

## 🤝🏻 Team Slid to-do

| <img width="268" alt="Image" src="https://github.com/user-attachments/assets/e73b4f54-fd73-46ba-ac71-22bee63dfae1" /> | <img width="268" alt="Image" src="https://github.com/user-attachments/assets/293f6f22-4d36-420a-979a-be79dc86d6d6" /> | <img width="268" alt="Image" src="https://github.com/user-attachments/assets/53b9b249-a2cc-49bc-9979-a39492874504" /> | <img width="268" alt="Image" src="https://github.com/user-attachments/assets/fb2046a9-e8a9-420a-a011-181ff6f33fcd" /> | <img width="268" alt="Image" src="https://github.com/user-attachments/assets/b8da23a4-6a04-492d-9efd-53a524f945d7" /> |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **윤예지(팀장)**                                                                                                      | **임민규**                                                                                                            | **노주영**                                                                                                            | **정유하**                                                                                                            | **박솔미**                                                                                                            |
| - 노트 모아보기/수정 페이지<br /> - 공통 훅·컴포넌트 개발                                                             | - 대시보드<br />- 사이드바<br />- 로그인/토큰 재발급/로그아웃<br />- 전역 스타일 개발                                 | - 할 일 페이지<br />- 할 일 생성모달<br />- 모달 커스텀 훅<br /> - 공통 컴포넌트 개발                                 | - 목표 페이지<br />- 노트 작성 페이지<br />- 무한스크롤 훅<br />- 공통 컴포넌트 개발                                  | - 로그인/회원가입 페이지<br />- 커스텀 훅<br />- 공통 컴포넌트 개발                                                   |

## 📐 팀 협업 컨벤션

[팀 협업 컨벤션](https://github.com/slid-to-do/slid-to-do-fe/blob/develop/CONVENTION.md)

## 🗒️ 팀 회고

<img width="793" alt="Image" src="https://github.com/user-attachments/assets/58820917-6d07-4d59-ba49-368188488245" />
