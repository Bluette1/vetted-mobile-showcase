# Vetted Mobile - Pet Health & Wellness Tracker

Vetted is a comprehensive mobile application designed for pet owners to manage their pets' health records, weight tracking, and daily wellness reminders. Built with **React Native** and **Expo Router**, it provides a seamless and modern native experience.

## ✨ Features

- **📊 Health Timeline**: Track vaccinations, medications, and vet visits in a clean, chronological feed.
- **📈 Weight Tracking**: Monitor your pet's growth with interactive charts.
- **🔔 Smart Reminders**: Never miss a medication or appointment with local push notifications.
- **🐾 Multi-Pet Management**: Quickly switch between multiple pets and view individual records.
- **💡 Health Insights**: Receive AI-driven insights based on your pet's health patterns.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (Link-based routing)
- **State Management**: React Context API (Auth & Pet states)
- **Styling**: Native StyleSheet with a custom design system
- **Icons**: [Lucide React Native](https://lucide.dev/guide/react-native)
- **Charts**: [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- **Backend API**: Laravel (PHP)

## 📸 Screenshots

<p align="center">
  <img src="assets/showcase/dashboard.png" width="300" alt="Dashboard" />
  <img src="assets/showcase/health.png" width="300" alt="Health Records" />
</p>

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bluette1/vetted-mobile-showcase.git
   cd vetted-mobile-showcase
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

## 📓 Portfolio Highlights

This project demonstrates a high level of proficiency in modern mobile engineering:

- **Full-Cycle Migration**: Successfully architected the transition from a React web application to a performance-optimized native mobile app.
- **Native System Integration**: Leveraged `expo-notifications` for deep OS-level integration, delivering timely pet care reminders.
- **Complex UI/UX**: Implemented a sophisticated navigation hierarchy using **Expo Router**, featuring nested tab and stack navigators.
- **Data Visualization**: Integrated `react-native-chart-kit` for real-time health data rendering, ensuring medical metrics are accessible and actionable.
- **Premium Design Implementation**: Translated a refined design system (using the **Nunito** font family and curated HSL color tokens) into a polished, responsive native interface.

## 🏗 Architecture

The app follows a structured, modular architecture:

- **Context API Layer**: Global state management for Authentication and Pet data, ensuring a "single source of truth" across the app.
- **Service Layer**: Decoupled API logic (`api.ts`) and Notification management (`notifications.ts`) for better testability and maintenance.
- **Component Pattern**: Reusable UI primitives (Cards, Buttons) built on top of React Native's `StyleSheet` for high performance.
- **File-Based Routing**: Clean, semantic routing structure following the latest Expo Router conventions.

---
*Created by [Bluette1](https://github.com/Bluette1)*
