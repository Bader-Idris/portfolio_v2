import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications'
import {
  PushNotifications,
  PushNotificationToken,
  PushNotificationSchema,
  PushNotificationActionPerformed
} from '@capacitor/push-notifications'

// Schedule a local notification
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  id: number = new Date().getTime(),
  attachments: LocalNotificationSchema['attachments'] = []
): Promise<void> => {
  try {
    await LocalNotifications.schedule({
      //! you can add buttons as in Duolingo using the option `registerActionTypes` extends to core/localNotificationAction
      notifications: [
        {
          title,
          body,
          id,
          schedule: { at: new Date(Date.now() + 1000 * 5) }, // 5 seconds later
          sound: '',
          smallIcon: '',
          attachments,
          actionTypeId: '',
          extra: null
        }
      ]
    })
    console.log(`Local notification scheduled: ID ${id}`)
  } catch (error) {
    console.error('Failed to schedule local notification: ', error)
  }
}

// Cancel a local notification
export const cancelLocalNotification = async (id: number): Promise<void> => {
  try {
    await LocalNotifications.cancel({ notifications: [{ id }] })
    console.log(`Local notification canceled: ID ${id}`)
  } catch (error) {
    console.error(`Failed to cancel local notification with ID ${id}: `, error)
  }
}

// Register for push notifications
export const registerPushNotifications = async (): Promise<void> => {
  try {
    // Request permissions for push notifications
    const result = await PushNotifications.requestPermissions()

    if (result.receive === 'granted') {
      await PushNotifications.register()
    } else {
      console.warn('Push notification permissions not granted.')
      return
    }

    // Handle registration success
    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      console.log('Push registration success, token: ' + token.value)
      // You can send the token to your backend for further processing
    })

    // Handle registration error
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push registration error: ', error)
    })

    // Handle push notification reception
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received: ', notification)
      }
    )

    // Handle push notification action performed
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push notification action performed: ', notification)
      }
    )
  } catch (error) {
    console.error('Push notification registration failed: ', error)
  }
}

// Schedule a welcome notification
export const scheduleWelcomeNotification = async (): Promise<void> => {
  const title = 'Welcome!'
  const body = 'Thanks for installing our app. We hope you enjoy using it!'
  const attachments = [{ id: 'welcome-image', url: 'assets/logo.svg' }]

  try {
    await scheduleLocalNotification(title, body, new Date().getTime(), attachments)
  } catch (error) {
    console.error('Failed to schedule welcome notification: ', error)
  }
}
