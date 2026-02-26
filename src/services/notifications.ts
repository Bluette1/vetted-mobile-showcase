import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

export async function scheduleReminderNotification(title: string, body: string, dateStr: string, timeStr: string) {
    const triggerDate = new Date(`${dateStr}T${timeStr}:00`);

    if (triggerDate < new Date()) return null;

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: { type: 'reminder' },
        },
        trigger: triggerDate,
    } as any);

    return id;
}
