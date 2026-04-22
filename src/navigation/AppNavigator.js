import React from 'react';
import { View, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Screens
import MyDataScreen from '../screens/MyDataScreen';
import AboutScreen from '../screens/AboutScreen';
import TermsScreen from '../screens/TermsScreen';
import PoliciesScreen from '../screens/PoliciesScreen';
import AppValuesScreen from '../screens/AppValuesScreen';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import AccountTypeScreen from '../screens/AccountTypeScreen';
import SignUpJobSeekerScreen from '../screens/SignUpJobSeekerScreen';
import SignUpJobSeekerStep2Screen from '../screens/SignUpJobSeekerStep2Screen';
import SignUpOrganizationScreen from '../screens/SignUpOrganizationScreen';
import SignUpOrganizationStep2Screen from '../screens/SignUpOrganizationStep2Screen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Job Seeker screens
import HomeScreen from '../screens/HomeScreen';
import CompaniesScreen from '../screens/CompaniesScreen';
import InterviewReminderScreen from '../screens/InterviewReminderScreen';
import EvaluationScreen from '../screens/EvaluationScreen';
import EvaluationFormScreen from '../screens/EvaluationFormScreen';
import MapScreen from '../screens/MapScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import JobApplicationScreen from '../screens/JobApplicationScreen';
import ApplicationSubmittedScreen from '../screens/ApplicationSubmittedScreen';
import InterviewSchedulingScreen from '../screens/InterviewSchedulingScreen';
import SignLanguageHomeScreen from '../screens/SignLanguageHomeScreen';
import SignLanguageCameraScreen from '../screens/SignLanguageCameraScreen';
import SignLanguageCommunicationScreen from '../screens/SignLanguageCommunicationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';

// Organization screens
import OrgDashboardScreen from '../screens/OrgDashboardScreen';
import ApplicantsListScreen from '../screens/ApplicantsListScreen';
import AddJobScreen from '../screens/AddJobScreen';
import AccessibilityIssuesScreen from '../screens/AccessibilityIssuesScreen';
import AccessibilityResponseScreen from '../screens/AccessibilityResponseScreen';
import OrgInterviewSchedulingScreen from '../screens/OrgInterviewSchedulingScreen';
import InterviewDetailsScreen from '../screens/InterviewDetailsScreen';

import colors from '../theme/colors';
import { SCREEN_NAMES } from '../constants/labels';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = colors.white;
const INACTIVE_COLOR = 'rgba(255,255,255,0.45)';

const renderTabIcon = (tabKey, isFocused) => {
  const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
  const size = 24;

  switch (tabKey) {
    // Job seeker
    case 'Home':
      return <Ionicons name="home" size={size} color={color} />;

    case 'Companies':
      return <Ionicons name="business" size={size} color={color} />;

    case 'Map':
      return <Ionicons name="map" size={size} color={color} />;

    case 'SignLanguage':
      return <MaterialIcons name="sign-language" size={size} color={color} />;

    // Organization
    case 'OrgDashboard':
      return <Ionicons name="bar-chart" size={size} color={color} />;

    case 'ApplicantsList':
      return <Ionicons name="people" size={size} color={color} />;

    case 'AddJob':
      return <Ionicons name="add-circle" size={size} color={color} />;

    case 'AccessibilityIssues':
      return <MaterialIcons name="report-problem" size={size} color={color} />;

    default:
      return <Ionicons name="ellipse" size={size} color={color} />;
  }
};

// ─────────────────────────────────────────
// Custom Tab Bar for Job Seeker
// ─────────────────────────────────────────
const JobSeekerTabBar = ({ state, navigation }) => {
  const tabs = [
    { key: 'Home' },
    { key: 'Companies' },
    { key: 'Map' },
    { key: 'SignLanguage' },
  ];

  return (
    <View style={tabStyles.bar}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.key}
            style={tabStyles.tabItem}
            onPress={() => navigation.navigate(tab.key)}
            activeOpacity={0.8}
          >
            <View style={tabStyles.iconWrap}>
              {renderTabIcon(tab.key, isFocused)}
            </View>
            {isFocused && <View style={tabStyles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─────────────────────────────────────────
// Job Seeker Bottom Tab Navigator
// ─────────────────────────────────────────
const JobSeekerTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <JobSeekerTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Companies" component={CompaniesScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="SignLanguage" component={SignLanguageHomeScreen} />
  </Tab.Navigator>
);

// ─────────────────────────────────────────
// Custom Tab Bar for Organization
// ─────────────────────────────────────────
const OrgTabBar = ({ state, navigation }) => {
  const tabs = [
    { key: 'OrgDashboard' },
    { key: 'ApplicantsList' },
    { key: 'AddJob' },
    { key: 'AccessibilityIssues' },
  ];

  return (
    <View style={tabStyles.bar}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.key}
            style={tabStyles.tabItem}
            onPress={() => navigation.navigate(tab.key)}
            activeOpacity={0.8}
          >
            <View style={tabStyles.iconWrap}>
              {renderTabIcon(tab.key, isFocused)}
            </View>
            {isFocused && <View style={tabStyles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─────────────────────────────────────────
// Organization Bottom Tab Navigator
// ─────────────────────────────────────────
const OrgTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <OrgTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="OrgDashboard" component={OrgDashboardScreen} />
    <Tab.Screen name="ApplicantsList" component={ApplicantsListScreen} />
    <Tab.Screen name="AddJob" component={AddJobScreen} />
    <Tab.Screen name="AccessibilityIssues" component={AccessibilityIssuesScreen} />
  </Tab.Navigator>
);

// ─────────────────────────────────────────
// Root Stack Navigator
// ─────────────────────────────────────────
const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName={SCREEN_NAMES.SPLASH}
    screenOptions={{
      headerShown: false,
      animation: 'fade',
      contentStyle: {
        direction: I18nManager.isRTL ? 'rtl' : 'ltr',
      },
    }}
  >
    {/* Auth Flow */}
    <Stack.Screen name={SCREEN_NAMES.PROFILE} component={ProfileScreen} />
    <Stack.Screen name={SCREEN_NAMES.MY_DATA} component={MyDataScreen} />
    <Stack.Screen name={SCREEN_NAMES.ABOUT} component={AboutScreen} />
    <Stack.Screen name={SCREEN_NAMES.TERMS} component={TermsScreen} />
    <Stack.Screen name={SCREEN_NAMES.POLICIES} component={PoliciesScreen} />
    <Stack.Screen name={SCREEN_NAMES.APP_VALUES} component={AppValuesScreen} />
    <Stack.Screen name={SCREEN_NAMES.SPLASH} component={SplashScreen} />
    <Stack.Screen name={SCREEN_NAMES.ONBOARDING} component={OnboardingScreen} />
    <Stack.Screen name={SCREEN_NAMES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={SCREEN_NAMES.ACCOUNT_TYPE} component={AccountTypeScreen} />
    <Stack.Screen name={SCREEN_NAMES.FORGOT_PASSWORD} component={ForgotPasswordScreen} options={{ headerShown: false }}/>
    <Stack.Screen name={SCREEN_NAMES.SIGNUP_JOB_SEEKER} component={SignUpJobSeekerScreen} />
    <Stack.Screen name={SCREEN_NAMES.SIGNUP_JOB_SEEKER_STEP2}component={SignUpJobSeekerStep2Screen}/>
    <Stack.Screen name={SCREEN_NAMES.SIGNUP_ORGANIZATION} component={SignUpOrganizationScreen}/>
    <Stack.Screen name={SCREEN_NAMES.SIGNUP_ORGANIZATION_STEP2} component={SignUpOrganizationStep2Screen}/>

    {/* Job Seeker Tab Flow */}
    <Stack.Screen name="JobSeekerTabNavigator" component={JobSeekerTabNavigator} />

    {/* Organization Tab Flow */}
    <Stack.Screen name="OrgTabNavigator" component={OrgTabNavigator} />

    {/* Shared Stack Screens */}
    <Stack.Screen name={SCREEN_NAMES.JOB_DETAILS} component={JobDetailsScreen} />
    <Stack.Screen name={SCREEN_NAMES.JOB_APPLICATION} component={JobApplicationScreen} />
    <Stack.Screen name={SCREEN_NAMES.APPLICATION_SUBMITTED} component={ApplicationSubmittedScreen}/>
    <Stack.Screen name={SCREEN_NAMES.INTERVIEW_SCHEDULING} component={InterviewSchedulingScreen}/>
    <Stack.Screen name={SCREEN_NAMES.SIGN_LANGUAGE} component={SignLanguageHomeScreen} />
    <Stack.Screen name={SCREEN_NAMES.SIGN_LANGUAGE_HOME} component={SignLanguageHomeScreen}/>
    <Stack.Screen name={SCREEN_NAMES.SIGN_LANGUAGE_CAMERA} component={SignLanguageCameraScreen}/>
    <Stack.Screen name={SCREEN_NAMES.SIGN_LANGUAGE_COMMUNICATION} component={SignLanguageCommunicationScreen}/>
    <Stack.Screen name={SCREEN_NAMES.EVALUATION} component={EvaluationScreen} options={{ headerShown: false }}/>
    <Stack.Screen name={SCREEN_NAMES.EVALUATION_FORM} component={EvaluationFormScreen}/>
    <Stack.Screen name={SCREEN_NAMES.INTERVIEW_REMINDER} component={InterviewReminderScreen}/>
    <Stack.Screen name={SCREEN_NAMES.LANGUAGE_SELECT} component={LanguageSelectScreen}/>

    {/* Org Stack Screens */}
    <Stack.Screen name={SCREEN_NAMES.ORG_DASHBOARD} component={OrgDashboardScreen} />
    <Stack.Screen name={SCREEN_NAMES.APPLICANTS_LIST} component={ApplicantsListScreen} />
    <Stack.Screen name={SCREEN_NAMES.ADD_JOB} component={AddJobScreen} />
    <Stack.Screen name={SCREEN_NAMES.ACCESSIBILITY_ISSUES} component={AccessibilityIssuesScreen}/>
    <Stack.Screen name={SCREEN_NAMES.ACCESSIBILITY_RESPONSE} component={AccessibilityResponseScreen}/>
    <Stack.Screen name={SCREEN_NAMES.ORG_INTERVIEW_SCHEDULING} component={OrgInterviewSchedulingScreen}/>
    <Stack.Screen name={SCREEN_NAMES.INTERVIEW_DETAILS} component={InterviewDetailsScreen}/>
  </Stack.Navigator>
);

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.secondary,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 8,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 6,
    minHeight: 52,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
});

export default AppNavigator;