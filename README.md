# شمولية – Shumouliya

<div align="right">

**لأن الشمولية حقٌّ يُقاس ويُطبَّق**

</div>

---

## 📖 Project Description

**Shumouliya (شمولية)** is a React Native mobile application designed to promote workplace inclusivity for persons with disabilities across public and private sector organizations in Saudi Arabia.

The application provides two main user experiences:

- **Job Seeker Flow** for exploring inclusive employers, accessible job opportunities, evaluation features, interview support, and sign language tools
- **Organization Flow** for managing applicants, publishing job opportunities, monitoring inclusivity indicators, and responding to accessibility issues

The project aims to support a more inclusive employment ecosystem by improving transparency, accessibility, communication, and workplace readiness.

---

## ✨ Features

### For Job Seekers
- 🏢 Browse inclusive organizations and review workplace readiness
- 💼 Explore accessible job opportunities
- 🗺️ View organizations and opportunities through an interactive map
- 📝 Submit workplace evaluations and feedback
- 📅 Receive interview reminders and schedule interviews
- 🤟 Use sign language support tools for communication

### For Organizations
- 📊 Monitor inclusivity indicators and score trends
- 👥 Review applicants and manage interview workflows
- ➕ Publish job opportunities
- ⚠️ View and respond to accessibility issues reported by users

### Shared Features
- 🔐 Authentication for different account types
- 🌙 Light and dark mode support
- 🌍 Arabic RTL interface
- 👤 Profile and settings management

---

## 📱 Main Screens

### Authentication & Onboarding
1. Splash Screen  
2. Onboarding Screen  
3. Login Screen  
4. Account Type Selection  
5. Sign Up – Job Seeker (Step 1)  
6. Sign Up – Job Seeker (Step 2)  
7. Sign Up – Organization (Step 1)  
8. Sign Up – Organization (Step 2)  
9. Forgot Password Screen  

### Job Seeker Screens
10. Home Screen  
11. Companies Screen  
12. Evaluation Screen  
13. Evaluation Form Screen  
14. Map Screen  
15. Job Details Screen  
16. Job Application Screen  
17. Application Submitted Screen  
18. Interview Reminder Screen  
19. Interview Scheduling Screen  
20. Sign Language Home Screen  
21. Sign Language Camera Screen  
22. Sign Language Communication Screen  
23. Profile Screen  
24. Language Select Screen  

### Organization Screens
25. Organization Dashboard Screen  
26. Applicants List Screen  
27. Organization Interview Scheduling Screen  
28. Add Job Screen  
29. Accessibility Issues Screen  
30. Accessibility Response Screen  
31. Profile Screen  

---

## 🛠 Technologies Used

| Technology | Purpose |
|-----------|---------|
| React Native (JavaScript) | Mobile application development |
| Expo | Development and testing environment |
| React Navigation v6 | Stack and bottom tab navigation |
| react-native-svg | Data visualization and score indicators |
| expo-linear-gradient | Gradient UI elements |
| react-native-safe-area-context | Safe area handling |
| react-native-screens | Native screen optimization |
| expo-image-picker | Media selection support |
| Context API | Theme and state sharing |

---

## 📁 Folder Structure

```bash
Shumouliya/
├── App.js
├── app.json
├── package.json
├── babel.config.js
├── assets/
└── src/
    ├── components/
    │   ├── AppHeader.js
    │   ├── CustomButton.js
    │   ├── CustomInput.js
    │   ├── ScoreIndicator.js
    │   ├── CompanyCard.js
    │   ├── ReminderCard.js
    │   ├── ApplicantCard.js
    │   ├── AccessibilityIssueCard.js
    │   └── HomeTopBar.js
    ├── screens/
    │   ├── SplashScreen.js
    │   ├── OnboardingScreen.js
    │   ├── LoginScreen.js
    │   ├── AccountTypeScreen.js
    │   ├── SignUpJobSeekerScreen.js
    │   ├── SignUpJobSeekerStep2Screen.js
    │   ├── SignUpOrganizationScreen.js
    │   ├── SignUpOrganizationStep2Screen.js
    │   ├── ForgotPasswordScreen.js
    │   ├── HomeScreen.js
    │   ├── CompaniesScreen.js
    │   ├── EvaluationScreen.js
    │   ├── EvaluationFormScreen.js
    │   ├── MapScreen.js
    │   ├── JobDetailsScreen.js
    │   ├── JobApplicationScreen.js
    │   ├── ApplicationSubmittedScreen.js
    │   ├── InterviewReminderScreen.js
    │   ├── InterviewSchedulingScreen.js
    │   ├── SignLanguageHomeScreen.js
    │   ├── SignLanguageCameraScreen.js
    │   ├── SignLanguageCommunicationScreen.js
    │   ├── OrgDashboardScreen.js
    │   ├── ApplicantsListScreen.js
    │   ├── OrgInterviewSchedulingScreen.js
    │   ├── AddJobScreen.js
    │   ├── AccessibilityIssuesScreen.js
    │   ├── AccessibilityResponseScreen.js
    │   ├── ProfileScreen.js
    │   └── LanguageSelectScreen.js
    ├── navigation/
    │   └── AppNavigator.js
    ├── data/
    │   └── mockData.js
    ├── constants/
    │   └── labels.js
    ├── context/
    │   └── ThemeContext.js
    ├── theme/
    │   ├── colors.js
    │   ├── spacing.js
    │   └── index.js
    ├── services/
    └── utils/

⚙️ Installation

Prerequisites

* Node.js >= 18
* npm or yarn
* Expo Go on iOS or Android device

# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/shumouliya.git

# 2. Move into the project folder
cd shumouliya

# 3. Install dependencies
npm install

# 4. Start the Expo development server
npx expo start 
