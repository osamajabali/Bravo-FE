# Angular Project

## Overview
This is an **Angular** project implementing client-side rendering with **internationalization**, **authentication guards**, **lazy-loaded routes**, and **various services** for HTTP requests, alerts, spinners, and lookups.

## Features
- **Angular Routing** with lazy loading
- **Authentication Guard**
- **HTTP Interceptor**
- **Internationalization (ngx-translate)**
- **Toastr Notifications**
- **Spinner Service for Loading Indicators**
- **Custom Directives**
- **Pagination Model**
- **Result Wrapper for API Responses**

---

## Project Structure

src/ │── app/ │ ├── core/ │ │ ├── interceptors/ │ │ │ ├── request.interceptor.ts │ │ ├── services/ │ │ │ ├── alert.service.ts │ │ │ ├── auth.guard.ts │ │ │ ├── http.service.ts │ │ │ ├── look-ups.service.ts │ │ │ ├── spinner.service.ts │ ├── features/ │ │ ├── authentication/ │ │ │ ├── login/ │ │ │ │ ├── login.component.ts │ │ │ │ ├── login.service.ts │ ├── layout/ │ │ ├── layout.component.ts │ ├── shared/ │ │ ├── directives/ │ │ │ ├── auto-form-error.directive.ts │ │ │ ├── max-value.directive.ts │ │ │ ├── no-leading-space.directive.ts │ │ │ ├── restrict-non-numeric.directive.ts │ │ ├── models/ │ │ │ ├── pagination.model.ts │ │ │ ├── result.ts │ │ │ ├── enums.ts │── assets/ │ ├── i18n/ (Contains translation files) │── environments/ │── app.component.ts │── app.component.html │── app.config.ts │── app.config.server.ts │── app.routes.ts │── main.routes.ts │── features.routes.ts


---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/osamajabali/Bravo-FE

### 2. Install Dependencies

npm install

### 3. Start the Application
ng serve

