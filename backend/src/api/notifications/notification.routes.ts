import { Router } from "express";





app.get('/', getNotificationsController);
app.get('/notification/mark-as-read', markNotificationAsReadController);
