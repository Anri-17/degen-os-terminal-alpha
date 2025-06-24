import express from 'express';
import { notifications } from '../index.js';

const router = express.Router();

// Get user alerts
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, unreadOnly = 'false' } = req.query;

    let alerts = notifications.getUserAlerts(userId, parseInt(limit as string));

    if (unreadOnly === 'true') {
      alerts = alerts.filter(alert => !alert.read);
    }

    const unreadCount = notifications.getUserAlerts(userId).filter(alert => !alert.read).length;

    res.json({
      success: true,
      data: alerts,
      unreadCount,
      total: notifications.getUserAlerts(userId).length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mark alert as read
router.put('/:userId/:alertId/read', async (req, res) => {
  try {
    const { userId, alertId } = req.params;

    notifications.markAlertAsRead(userId, alertId);

    res.json({
      success: true,
      message: 'Alert marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mark all alerts as read
router.put('/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;

    notifications.markAllAlertsAsRead(userId);

    res.json({
      success: true,
      message: 'All alerts marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send test alert
router.post('/test/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type = 'test', title = 'Test Alert', message = 'This is a test alert' } = req.body;

    const alert = await notifications.sendAlert({
      userId,
      type,
      title,
      message
    });

    res.json({
      success: true,
      message: 'Test alert sent',
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get notification preferences
router.get('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = notifications.getNotificationPreferences(userId);

    res.json({
      success: true,
      data: preferences || {
        userId,
        telegram: false,
        email: false,
        push: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update notification preferences
router.put('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: preferences'
      });
    }

    const updatedPreferences = {
      userId,
      ...preferences
    };

    notifications.setNotificationPreferences(userId, updatedPreferences);

    res.json({
      success: true,
      message: 'Notification preferences updated',
      data: updatedPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as alertRoutes };