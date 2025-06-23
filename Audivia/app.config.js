import 'dotenv/config';
export default {
  "expo": {
    "name": "Audivia",
    "slug": "audivia",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/logoAudi.png",
    "splash": {
      "image": "./assets/images/logoAudi.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "scheme": "audivia",
    "deepLinking": true,
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.audivia.app",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "We need your location to show you nearby tours and guide you during a tour.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "Allow $(PRODUCT_NAME) to use your location to provide tour alerts even when the app is in the background.",
        "NSLocationAlwaysUsageDescription": "Allow $(PRODUCT_NAME) to use your location to provide tour alerts even when the app is in the background.",
        "UIBackgroundModes": [
          "location",
          "fetch"
        ]
      }
    },
    "android": {
      "package": "com.audivia.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.ACCESS_BACKGROUND_LOCATION"
      ]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location to provide tour alerts.",
          "isBackgroundLocationEnabled": true,
          "isAndroidBackgroundLocationEnabled": true
        }
      ],
      // [
      //   "expo-notifications",
      //   {
      //     "icon": "./assets/images/notification-icon.png",
      //     "color": "#ffffff"
      //   }
      // ],
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],

      "expo-font",
      // [
      //   "@react-native-google-signin/google-signin",
      // ],
      "expo-video"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "permissions": [
      "LOCATION",
      "LOCATION_BACKGROUND"
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "f2a89538-adbf-47fb-b851-3a138194381b"
      },
    }
  }
}