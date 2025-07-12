package com.pushnotificationapp;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import android.util.Log;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.content.Context;
import androidx.core.app.NotificationCompat;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage message) {
        String title = message.getNotification() != null ? message.getNotification().getTitle() : "Notification";
        String body = message.getNotification() != null ? message.getNotification().getBody() : "";

        showNotification(title, body);
    }

    private void showNotification(String title, String message) {
        String channelId = "default_channel";
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, "Push Notifications",
                    NotificationManager.IMPORTANCE_HIGH);
            manager.createNotificationChannel(channel);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                .setContentTitle(title)
                .setContentText(message)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setPriority(NotificationCompat.PRIORITY_HIGH);

        manager.notify(1, builder.build());
    }
}
