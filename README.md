Team Task Management Dashboard

A real-time, reliable collaborative platform inspired by Slack and Discord. This application is built with a modern tech stack designed to ensure a seamless user experience through a live, interactive interface and guaranteed message delivery, even for offline users.

Architectural Goals

This project is built on three core systems working together to create a sophisticated real-time application:

    Core REST API: The foundational layer for all data operations (CRUD), providing a reliable "source of truth."

    Real-Time Layer: A WebSocket server that manages online presence and broadcasts live updates to all connected clients.

    Asynchronous Notification System: A safety net using a database-backed inbox and push notifications (FCM) to ensure no messages or updates are ever missed.

App Features & Roadmap

Foundation: Core API & Data Model

    [ ] Project & Task CRUD: Full create, read, update, and delete functionality for projects and their associated tasks.

    [ ] User Authentication & Profiles: Secure user registration and login, with customizable user profiles.

    [ ] Social System: Ability for users to find and connect with others to collaborate on projects.

    [ ] Image Uploading: Support for uploading user avatars and attaching images to messages.

The Live Experience: Real-Time Layer

    [ ] Online Presence Indicators: Show which users are currently online, offline, or idle.

    [ ] Live Channel Messaging: Instantaneous message delivery in project channels for all online users.

    [ ] Real-Time UI Updates: Instantly reflect changes like new tasks or status updates without a page refresh.

Guaranteed Delivery: Asynchronous Notifications

    [ ] Offline Inbox System: Store all notifications (new messages, task assignments) in the database for users who are offline.

    [ ] Fetch on Reconnect: Deliver all missed notifications to a user the moment they come back online.

    [ ] FCM Push Notifications: Send push notifications to alert users of important, direct updates when the app is closed.

User Experience & Polish

    [ ] Frontend: Rewrite in Solid.js 

    [ ] Dark Mode: A sleek dark mode option for the user interface.

    [ ] Search & Filtering: Implement search functionality for tasks, projects, and messages.

    [ ] Robust Testing & CI/CD: Build out a comprehensive test suite and a fully automated CI/CD pipeline for deployments.

Technology Stack


Backend

    Framework: Node.js with Express

    Real-Time: socketio library for WebSocket communication

    Database: Google PostgreSQL

    ORM: Prisma

    Push Notifications: Firebase Admin SDK (FCM)

Frontend

    Framework: solid.js 

    Real-Time Client: WebSocket API

    Push Notifications: Firebase FCM 

DevOps & Cloud

    Containerization: Docker

    CI/CD: GitHub Actions

    Frontend Deployment: FireBase


    Backend Deployment: Google Cloud Run

