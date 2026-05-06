شمولية – Shumouliya

لأن الشمولية حقٌّ يُقاس ويُطبَّق

⸻

Project Description

Shumouliya (شمولية) is a React Native mobile application developed to support workplace inclusivity and accessibility for persons with disabilities across public and private sector organizations in Saudi Arabia.

The application provides two integrated user experiences:

* Job Seeker Flow for discovering inclusive organizations, exploring accessible job opportunities, managing interviews, submitting workplace evaluations, accessing sign language communication tools, and tracking applications.
* Organization Flow for publishing and managing job opportunities, monitoring inclusivity indicators, reviewing applicants, scheduling interviews, and responding to accessibility-related reports.

The project aims to contribute to a more inclusive employment ecosystem by improving accessibility, communication, transparency, and workplace readiness in alignment with Saudi Vision 2030.

⸻

Features

Job Seeker Features

* Browse organizations and review inclusivity information
* Explore and apply for accessible job opportunities
* Save preferred job opportunities
* View organizations and opportunities through an interactive map
* Submit workplace evaluations and accessibility feedback
* Receive interview reminders and manage interview schedules
* Access sign language communication tools
* Manage profile information and account settings

⸻

Organization Features

* Publish and manage job opportunities
* Edit and manage organization profile information
* View and manage applicants
* Schedule and organize interview workflows
* Monitor inclusivity indicators and accessibility metrics
* View and respond to accessibility issues reported by users
* Manage organization opportunities through a dedicated dashboard

⸻

Shared Features

* Authentication for multiple account types
* Firebase Authentication integration
* Cloud Firestore database integration
* Firebase Storage support for profile images
* Arabic RTL interface support
* Light and dark mode support
* Notifications and reminders
* Profile and settings management
* Interactive navigation using Stack and Bottom Tabs

⸻

Main Screens

Authentication & Onboarding

* Splash Screen
* Onboarding Screen
* Login Screen
* Account Type Selection
* Sign Up – Job Seeker (Step 1)
* Sign Up – Job Seeker (Step 2)
* Sign Up – Organization (Step 1)
* Sign Up – Organization (Step 2)
* Forgot Password Screen

⸻

Job Seeker Screens

* Home Screen
* Companies Screen
* Evaluation Screen
* Evaluation Form Screen
* Map Screen
* Job Details Screen
* Job Application Screen
* Application Submitted Screen
* Interview Reminder Screen
* Interview Scheduling Screen
* Job Seeker Interviews Screen
* Job Seeker Interview Details Screen
* Saved Jobs Screen
* Sign Language Home Screen
* Sign Language Camera Screen
* Sign Language Communication Screen
* Profile Screen
* My Data Screen
* Language Select Screen
* Notifications Screen

⸻

Organization Screens

* Organization Dashboard Screen
* Applicants List Screen
* Organization Interview Scheduling Screen
* Interview Details Screen
* Add Job Screen
* Organization Jobs Screen
* Accessibility Issues Screen
* Accessibility Response Screen
* Company Details Screen
* Edit Company Profile Screen
* Pick Location Screen
* Profile Screen
* My Data Screen
* Notifications Screen

⸻

Technologies Used

Technology	Purpose
1- React Native (JavaScript) = Mobile application development
2- Expo	= Development and testing environment
3- React Navigation v6 = Stack and bottom tab navigation
4- Firebase Authentication = User authentication
5- Cloud Firestore = Real-time database management
6- Expo Image Picker = Media and image selection
7- React Native SVG = Data visualization and score indicators
8- Expo Linear Gradient	= Gradient UI components
9- React Native Safe Area Context = Safe area handling
10- React Native Screens = Native screen optimization
11- Context API	= Theme and global state management

⸻

Folder Structure

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
    │
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
    │   ├── JobSeekerInterviewsScreen.js
    │   ├── JobSeekerInterviewDetailsScreen.js
    │   ├── SavedJobsScreen.js
    │   ├── SignLanguageHomeScreen.js
    │   ├── SignLanguageCameraScreen.js
    │   ├── SignLanguageCommunicationScreen.js
    │   ├── OrgDashboardScreen.js
    │   ├── ApplicantsListScreen.js
    │   ├── OrgInterviewSchedulingScreen.js
    │   ├── InterviewDetailsScreen.js
    │   ├── AddJobScreen.js
    │   ├── OrgJobsScreen.js
    │   ├── AccessibilityIssuesScreen.js
    │   ├── AccessibilityResponseScreen.js
    │   ├── CompanyDetailsScreen.js
    │   ├── EditCompanyProfileScreen.js
    │   ├── PickLocationScreen.js
    │   ├── ProfileScreen.js
    │   ├── MyDataScreen.js
    │   ├── LanguageSelectScreen.js
    │   └── NotificationsScreen.js
    │
    ├── navigation/
    │   └── AppNavigator.js
    │
    ├── constants/
    │   └── labels.js
    │
    ├── context/
    │   ├── AuthContext.js
    │   └── ThemeContext.js
    │
    ├── services/
    │   └── firebase.js
    │
    ├── data/
    │   └── mockData.js
    │
    ├── theme/
    │   ├── colors.js
    │   ├── spacing.js
    │   └── index.js
    │
    └── utils/

⸻

Installation

Prerequisites

* Node.js >= 18
* npm or yarn
* Expo Go on iOS or Android device

⸻

Setup Instructions

# Clone the repository
git clone https://github.com/ZainabDreamer/CS526-Project.git
# Move into the project folder
cd CS526-Project
# Install dependencies
npm install
# Start the Expo development server
npx expo start

⸻

Development Notes

* The application fully supports Arabic RTL layouts.
* Firebase services are integrated for authentication, database management, and media storage.
* The system follows a role-based architecture for Job Seekers and Organizations.
* Navigation is implemented using Stack Navigation and Bottom Tab Navigation.
* Theme management supports both light and dark modes using Context API.
* Firestore is used for job management, applications, evaluations, accessibility reports, and interview workflows.
* Firebase Storage is used for profile image uploading and management.
* The application was developed and tested using Expo and React Native on iOS and Android environments.
