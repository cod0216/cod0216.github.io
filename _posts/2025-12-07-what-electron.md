---
title: 일렉트론 - 개념편
date: 2025-12-07 00:00:00 +0900
categories: [Programing, Electron]
tags: [Electron]
toc: true
comments: true
---

## 1. Electron이란?

Electron은 2013년 GitHub에서 텍스트 편집기인 Atom을 구동하기 위해 만들어진 프레임워크다. Atom 개발 팀들은 다음과 같은 고민을 하게 됐다.

> 브라우저 엔진(Chromium)과 Node.js를 합치면 바로 사용할 수 있는 데스크톱 앱을 만들 수 있지 않을까?
> 

이 아이디어로 만들어진 프로젝트가 처음에는 Atom Shell이라는 이름으로 Atom을 구동하기 위한 데스크톱 런타임이 개발되었지만, 이후 2년 뒤 Atom뿐만 아니라 많은 데스크톱 앱 개발에 사용되며 전자를 다루듯 가볍고 빠르게 동작하는 런타임 프레임워크는 뜻으로 오늘날 Electron으로 개명되었다.

## 2. Electron 주요 구성

Electron은 브라우저 엔진과 Node.js를 결합한 데스크톱 앱 프레임워크다. 그렇기에 서로 안전한 상호작용을 하기 위해 크게 4가지 영역으로 구성된다.


![image.png](/assets/img/what-electron/1.png)

### Main Process

Main Process는 Node.js 기반인 프로세스다. 그렇기에 JS뿐만 아니라 Node.js의 모든 기능을 사용할 수 있는 프로세스이며 Electron에서 시스템 리소스 접근, 시스템 콜, 백그라운드 로직 등을 수행하며 오직 하나만 존재할 수 있다.

### Renderer Process

Renderer Process는 Chromium 엔진에서 동작하는 프로세스다. JS와 WebAPI 등 브라우저 관련 기능을 사용할 수 있고 웹 페이지처럼 사용자가 보는 모든 화면을 렌더링하며 UI/UX를 담당한다. 해당 프로세스는 멀티 프로세스 아키텍처를 사용하고 있으며 Node.js 기능은 없다.

### Preload Script

Preload Script는 렌더러 프로세스가 웹 페이지를 그리기 전에 실행되는 스크립트다. Renderer Process에서 Node API를 사용할 수 없기에 해당 스크립트를 Renderer Process에 노출시켜 Main Process와  상호작용을 도와준다.

### Utility Process

Utility Process는 Main Process 작업의 일부를 처리하기 위한 프로세스다. Main Process는 단일 프로세스이므로 많은 연산 로직이나 충돌이 우려되는 작업으로 인해 해당 프로세스가 죽지 않도록 Utility Process를 만들고 해당 프로세스를 통해 Main Process 일부 연산 작업을 처리한다.

## 3. 두 가지 프로세스 (Main Process vs Renderer Process)

Electron에서 애플리케이션의 구조를 설명할 땐 주로 Main Process와 Renderer Process로 설명한다. 이유는 다음과 같다.

Main Process는 Node.js에서 동작하기 때문에 OS 기능들을 사용할 수 있다. 또한 V8 엔진을 사용하므로 JavaScript 언어도 사용할 수 있다. 즉, 연산, I/O 기능, 네트워크 기능 등 백엔드 기능을 수행할 수 있다. Node.js이기에 특정 OS에 구애받지 않는 크로스 플랫폼 애플리케이션을 제작할 수 있다.

> 크로스 플랫폼이란? Windows, macOS, Linux 등 여러 운영체제에서 동일하게 실행될 수 있도록 설계된 기술을 말한다. 크로스 플랫폼은 운영체제 종속(OS-specific) 로직을 최소화하고, 운영체제 독립적(OS-agnostic)인 소프트웨어 제작을 핵심 철학으로 한다.
> 

**Renderer Process**는 크롬 브라우저에서 사용하는 Chromium 엔진을 이용해 UI를 렌더링하며 흔히 프론트엔드 역할을 한다. 그래서 사용자에게 보여지는 모든 처리는 Renderer Process에서 처리되며 Renderer Process는 Node.js가 아니기 때문에 관련 API가 없고 대신 Web API를 사용할 수 있다. 그리고 Chromium에서도 V8 엔진을 사용하므로 JavaScript 사용이 가능하며 sandbox 내에서 작업이 수행된다.

### Main Process와 Renderer Prcoess 실행 순서

![image.png](/assets/img/what-electron/2.png)

Electron이 실행되면 런타임 내부에서 Node.js와 Chromium의 BrowserProcess가 초기화되며 하나의 Main Process로 통합되어 동작한다. Main Process는 BrowserWindow 객체를 생성하고, BrowserWindow는 내부적으로 Chromium의 BrowserProcess에게 새로운 Renderer Process 생성을 요청한다. BrowserProcess는 OS 수준에서 **독립적인 Renderer Process를 생성하며, 생성된 Renderer Process는 먼저 preload 스크립트를 실행한 뒤 index.html을 로드하고 렌더링을 수행한다.

> BrowserWindow는 빈 창을 만들며 최소화, 개발자 모드 등 상단 옵션 등 프레임을 만드는 역할을 한다. Java의 Swing과 비슷한 역할을 한다고 생각하면 된다.
> 

**정정)**
Main Process는 Browser Process를 래핑하거나 직접 제어하는 구조가 아니라, 필요한 모듈을 import하여 기능을 구성하고 이를 통해 애플리케이션을 제어한다.

Browser Process를 감싸는 구조와 단순히 모듈을 import하여 사용하는 것은 개념적으로 다르다고 판단되어 해당 내용을 남긴다.


### 프로세스 간 통신, IPC 통신

프로세스끼리는 서로 통신을 할 때 IPC 통신을 통해 서로 상호 작용을 할 수 있다. 그 이유는 메모리를 공유하지 않기 때문에 서로 데이터를 주고받으려면 반드시 IPC 통신이 필요하기 때문이다.

- 프로세스는 서로 메모리를 공유하지 않는다.
    - 다른 프로세스가 메모리를 훔치거나 조작할 경우 보안 문제가 발생한다.
    - 하나의 프로세스가 메모리를 망가뜨려 다른 프로세스까지 영향을 준다.
- 프로세스끼리는 기본적으로 변수 공유, 함수 호출, 객체 주입, 스레드 공유, 주소 공유 등이 불가하다.

즉, 다른 프로세스여서가 아니라 메모리를 공유하지 않기 때문에 IPC 통신으로 데이터를 전달해야 한다. Electron에서도 ipcMain과 ipcRenderer를 이용해 Main Process와 Renderer Process 사이에 추상화 된 Electron IPC 통신을 한다.

![image.png](/assets/img/what-electron/3.png)

Electron에서 Main Process는 Chromium의 Browser Process 역할을 함께 수행한다. Browser Process와 Renderer Process는 서로 다른 프로세스이기 때문에(당연히 메모리 공유도 없다.) 두 프로세스 간 통신은 Mojo IPC로 이루어 지게 된다. 

> 실제로 Electron IPC 내부에서의 통신은 Chromium엔진에서 사용하는 Mojo방식을 통해 IPC 통신을 사용한다. 참고로 Mojo IPC는 C++을 통한 바이트 스트림만 가능하다.
> 

![image.png](/assets/img/what-electron/4.png)

예를 들어 Main에서 Renderer로 데이터를 보낼 때는, Main Process의 JS에서 보낸 JS 객체가 Electron의 JS API를 통해 C++ 바인딩 레이어로 전달되고, 여기서 Mojo 메시지로 직렬화되어 Renderer Process로 전송된다. Renderer 쪽에서는 Mojo 메시지를 C++에서 역직렬화한 뒤 다시 JS 값으로 변환하여 ipcRenderer에 전달한다. 이 과정을 Electron IPC 통신이라고 한다.

## 4. 정리

### Electron이란?

- Electron은 **Chromium**과 **Node.js**를 결합해 데스크톱 앱을 만들 수 있도록 한 프레임워크다.

### Electron의 구성 요소

- Main Process
    - Node.js와 Chromium의 Browser Process 기능으로 구성되어 있으며 Node Api를 사용할 수 있다.
- Renderer Process
    - Chromium 엔진에서 동작하며 Web API를 사용할 수 있다. 멀티 프로세스 아키텍처를 사용한다.
- Preload Script
    - Renderer Process에 사용 가능한 Node API 인터페이스를 노출시켜 Main Procss와 안전한 상호작용을 도와준다.
- Utility Process
    - Main Process가 직접 처리하기 부담스러운 연산을 대신 처리해준다.

### 실행 순서

Electron 실행 → Node.js, BrowserProcess 초기화 → 하나의 Main Process 생성 → Main이 BrowserWindow 생성 → BrowserProcess가 새 Renderer Process 생성 → Renderer가 preload → index.html 순으로 실행

### 프로세스 간 통신, IPC

- Main Process와 Renderer Process는 서로 다른 프로세스이므로 반드시 IPC 통신을 사용해야 한다
