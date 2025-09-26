Team Task Management Dashboard

A real-time, reliable collaborative platform inspired by Slack and Discord. This application is built with a modern tech stack designed to ensure a seamless user experience through a live, interactive interface and guaranteed message delivery, even for offline users.

Architectural Goals

This project is built on three core systems working together to create a sophisticated real-time application:

    Core REST API: The foundational layer for all data operations (CRUD), providing a reliable "source of truth."

    Real-Time Layer: A WebSocket server that manages online presence and broadcasts live updates to all connected clients.


App Features & Roadmap

Foundation: Core API & Data Model

    [ ] Workspace & Task CRUD: Full create, read, update, and delete functionality for workspaces and their associated tasks.

    [ ] User Authentication & Profiles: Secure user registration and login, with customizable user profiles.

    [ ] Social System: Ability for users to find and connect with others to collaborate on workspaces.

    [ ] Image Uploading: Support for uploading user avatars and attaching images to messages.

The Live Experience: Real-Time Layer

    [ ] Online Presence Indicators: Show which users are currently online, offline, or idle.

    [ ] Live Channel Messaging: Instantaneous message delivery in workspace channels for all online users.

    [ ] Real-Time UI Updates: Instantly reflect changes like new tasks or status updates without a page refresh.

Guaranteed Delivery: Asynchronous Notifications

    [ ] Fetch on Reconnect: For a webapp, this means users who have a tab minimized or backgrounded will receive all missed messages and updates upon returning.

User Experience & Polish

    [ ] Frontend: Solid.js 

    [ ] Dark Mode: A sleek dark mode option for the user interface.

    [ ] Search & Filtering: Implement search functionality for tasks, workspaces, and messages.

    [ ] Robust Testing & CI/CD: Build out a comprehensive test suite and a fully automated CI/CD pipeline for deployments.

Technology Stack

Backend

    Framework: Node.js with Express

    Real-Time: socketio library for WebSocket communication

    Database: Google PostgreSQL
    
    Datastore: Redis for caching and session management

    ORM: Prisma
    

Frontend

    Framework: solid.js 

    Real-Time Client: WebSocket API
    
    State Management: solid-js/store

Authentication: Firebase Authentication

DevOps & Cloud

    Containerization: Docker

    CI/CD: GitHub Actions

    Frontend Deployment: FireBase

    Backend Deployment: Google Cloud Run


