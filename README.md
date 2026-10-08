# Dev Place

> A simple personal web space for **projects, downloads, resources and useful tools**.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)  
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)  
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  
[![GitHub Pages](https://img.shields.io/badge/Hosted%20with-GitHub%20Pages-222222?logo=github&logoColor=white)](https://pages.github.com/)  
[![License](https://img.shields.io/badge/license-MIT-blue)](https://chatgpt.com/c/LICENSE)

**[Open Dev Place →](https://adrian-lis.github.io/DevPlace/)**

---

## Overview

**Dev Place** is a personal static website designed as a central place for projects, downloadable files, resources and useful tools.

The website is built entirely with standard web technologies:

- **HTML** — structure and content
    
- **CSS** — layout, styling and responsive design
    
- **JavaScript** — interaction and dynamic functionality
    
- **SVG** — scalable website graphics
    

The project is intentionally lightweight and does not rely on a frontend framework, backend or database.

---

## Features

|Area|Features|
|:--|:--|
|**Design**|Clean, responsive and minimal interface|
|**Themes**|Dark and light mode|
|**Accessibility**|High contrast, reduced motion and text-size controls|
|**Settings**|Persistent browser preferences|
|**Search**|Client-side website search|
|**Projects**|Project and development showcase|
|**Downloads**|Public files and downloadable resources|
|**About**|Website and repository information|
|**Navigation**|Responsive navigation menu|
|**Graphics**|SVG-based logo|
|**Hosting**|GitHub Pages|
|**Backend**|Not required|

---

## Website

The site is organized into four main sections.

|Section|Description|
|:--|:--|
|**Home**|Main landing page with an overview of available content|
|**Downloads**|Files and resources available for download|
|**Projects**|Projects, experiments and development work|
|**About**|Information about the website and its repository|

---

## Accessibility

Accessibility controls are integrated directly into the website.

### Available settings

- **Dark / Light theme**
    
- **Text size adjustment**
    
- **High contrast**
    
- **Reduced motion**
    
- **Reset settings**
    

User preferences are stored locally in the browser using `localStorage`.

```text
devplace-settings
```

No user account or server-side storage is required.

---

## Search

Dev Place includes a client-side search system for navigating website content.

The search functionality is implemented in:

```text
scripts/search.js
```

Search is performed directly in the browser without an external search service.

---

## Downloads

The website includes a dedicated Downloads section for publicly available files.

Downloadable files are stored in:

```text
files/
```

Example:

```text
files/
└── WinSystemInfo.zip
```

The directory is intended only for files that are safe and appropriate to make publicly accessible.

---

## Repository Structure

``` text
.
├── about/
│   └── index.html
│
├── downloads/
│   └── index.html
│
├── files/
│   └── WinSystemInfo.zip
│
├── images/
│   └── logo.svg
│
├── projects/
│   └── index.html
│
├── scripts/
│   ├── about.js
│   ├── main.js
│   ├── projects.js
│   └── search.js
│
├── .gitignore
├── index.html
├── README.md
└── style.css
```

### Main components

|Component|Purpose|
|:--|:--|
|`index.html`|Main homepage|
|`style.css`|Global visual design and responsive layout|
|`scripts/main.js`|Navigation, accessibility and general UI|
|`scripts/search.js`|Website search|
|`scripts/about.js`|About page functionality|
|`scripts/projects.js`|Projects functionality|
|`images/logo.svg`|Website logo|
|`files/`|Public downloadable files|

---

## Architecture

Dev Place follows a simple static architecture:

```text
                    GitHub Repository
                           │
                           ▼
                     GitHub Pages
                           │
                           ▼
                    Public Website
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
           HTML           CSS       JavaScript
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                        Browser
```

There is no application server, database or backend component.

This keeps the website lightweight and suitable for static hosting.

---

## GitHub Pages

Dev Place is published through **GitHub Pages**.

GitHub Pages provides the hosting layer for the website while the repository contains the complete source of the site.

The deployment consists of:

```text
HTML
CSS
JavaScript
SVG
Downloadable files
```

No separate hosting infrastructure is required for the website.

---

## Design Principles

|Principle|Description|
|:--|:--|
|**Simple**|Keep the interface clear and understandable|
|**Lightweight**|Avoid unnecessary libraries and dependencies|
|**Accessible**|Provide practical accessibility controls|
|**Responsive**|Adapt to different screen sizes|
|**Maintainable**|Keep structure, styling and functionality separated|
|**Portable**|Use standard web technologies|
|**Static**|No backend or database required|

---

## Technology

```text
HTML5
CSS3
JavaScript
SVG
GitHub Pages
```

The project does not require a frontend framework such as React, Vue or Angular.

---

## Project Status

**Active development**

Dev Place is continuously evolving as new projects, resources, downloads and improvements are added.

---

## License

This project is licensed under the **MIT License**.

See [`LICENSE`](https://chatgpt.com/c/LICENSE) for the full license text.

> [!IMPORTANT]  
> The MIT License applies to the project files covered by that license. Third-party software, trademarks, external resources and separately distributed files may be subject to their own licenses and terms.

---

**Dev Place · 2026**
