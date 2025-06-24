import { EventEmitter } from 'events';

export interface Alert {
  id: string;
  userId: string;
  type: 'sniper' | 'copy_trade' | 'rugger' | 'price' | 'portfolio';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: any;
}

export interface NotificationPreferences {
  userId: string;
  telegram: boolean;
  email: boolean;
  push: boolean;
  telegramChatId?: string;
  emailAddress?: string;
}

export class NotificationService extends EventEmitter {
  private alerts: Map<string, Alert[]> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();
  private telegramBotToken: string;

  constructor() {
    super();
    this.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || '';
  }

  async sendAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) {
    const fullAlert: Alert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    // Store alert
    if (!this.alerts.has(alert.userId)) {
      this.alerts.set(alert.userId, []);
    }
    this.alerts.get(alert.userId)!.unshift(fullAlert);

    // Send notifications based on user preferences
    const prefs = this.preferences.get(alert.userId);
    if (prefs) {
      if (prefs.telegram && prefs.telegramChatId) {
        await this.sendTelegramNotification(prefs.telegramChatId, fullAlert);
      }
      
      if (prefs.email && prefs.emailAddress) {
        await this.sendEmailNotification(prefs.emailAddress, fullAlert);
      }
    }

    this.emit('alertSent', fullAlert);
    return fullAlert;
  }

  private async sendTelegramNotification(chatId: string, alert: Alert) {
    if (!this.telegramBotToken) {
      console.warn('Telegram bot token not configured');
      return;
    }

    try {
      const message = `🚨 *${alert.title}*\n\n${alert.message}`;
      
      const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      console.log(`Telegram notification sent to ${chatId}`);
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
    }
  }

  private async sendEmailNotification(email: string, alert: Alert) {
    // Email implementation would go here
    // For now, just log
    console.log(`Email notification would be sent to ${email}: ${alert.title}`);
  }

  // Public API methods
  getUserAlerts(userId: string, limit: number = 50): Alert[] {
    const userAlerts = this.alerts.get(userId) || [];
    return userAlerts.slice(0, limit);
  }

  markAlertAsRead(userId: string, alertId: string) {
    const userAlerts = this.alerts.get(userId);
    if (userAlerts) {
      const alert = userAlerts.find(a => a.id === alertId);
      if (alert) {
        alert.read = true;
      }
    }
  }

  markAllAlertsAsRead(userId: string) {
    const userAlerts = this.alerts.get(userId);
    if (userAlerts) {
      userAlerts.forEach(alert => alert.read = true);
    }
  }

  setNotificationPreferences(userId: string, prefs: NotificationPreferences) {
    this.preferences.set(userId, prefs);
  }

  getNotificationPreferences(userId: string): NotificationPreferences | undefined {
    return this.preferences.get(userId);
  }

  // Convenience methods for common alert types
  async sendSniperAlert(userId: string, tokenSymbol: string, amount: string, profit: string) {
    return this.sendAlert({
      userId,
      type: 'sniper',
      title: 'Sniper Bot Success',
      message: `Successfully sniped ${tokenSymbol} for ${amount}. Current profit: ${profit}`
    });
  }

  async sendRuggerAlert(userId: string, walletAddress: string, tokenSymbol: string, action: string) {
    return this.sendAlert({
      userId,
      type: 'rugger',
      title: 'Rugger Wallet Alert',
      message: `Watched rugger wallet ${walletAddress} performed ${action} on ${tokenSymbol}`
    });
  }

  async sendCopyTradeAlert(userId: string, leaderWallet: string, tokenSymbol: string, action: string) {
    return this.sendAlert({
      userId,
      type: 'copy_trade',
      title: 'Copy Trade Executed',
      message: `Copied ${action} of ${tokenSymbol} from ${leaderWallet}`
    });
  }
}