# some info

```sh
# this is how to easily handle icon of our capacitor application
npm install @capacitor/assets --save-dev
# but Android 12+ required!
```

Check this [Cap url](https://capacitorjs.com/docs/guides/splash-screens-and-icons) docs

It requires these files:

```tree
assets/
├── icon-only.png
├── icon-foreground.png
├── icon-background.png
├── splash.png
└── splash-dark.png
```

Because I had the files, I only used `npx capacitor-assets generate` without recreating the files!

---

> good tips & tricks

Simon On YouTube, put these as a setup.sh file

```sh
# before these steps, install @ionic/cli @ionic/core && maybe @capacitor/cli also, -g is great here,
# would love to also add ionic/vue ionic/vue-router
ionic start appFile blank --type=vue --capacitor --package-id=com.example.appname # I changed its framework
# Best Bundle id practice is to use Reverse Domain Name Notation
# --package-id === bundle id, critical to push notifications
cd ./appFile
ionic build
bunx cap add ios android
```

---

Push notification, we need to use a notification provider as `cloud messaging FCM`

The causing of crash is of not adding correct configs with this plugin, check the [official deduced docs](https://capacitorjs.com/docs/apis/push-notifications)

in the capacitor.config.json/ts file, add the part: _it's well set in the docs_

```ts
/// <reference types="@capacitor/push-notifications" />

import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  plugins: {
    //! This is the important code
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
}
export default config
```

then create an fcm api file, then put that json file into the `/android/app/google-services.json`, that's the android part, ios is a little more complex

IOS approach, go to apple developer program [at](developer.apple.com), then create the paid account then access the identifier section get an `app id` activate the push notifications permission, then click `edit` you'll find the download part, or cp the data, _2nd approach_ is to create a certificate then view the `app push notification service SSL` checkbox, then open the `key-chain access` from macOS to save the certificate, similar to apps running in windows when they ask for the admin permissions!

an easier approach is to go to `keys` section, it's limited to two app push keys here, then we can directly use that file in FCM for ios devices.

we need to use x-code, so postpone that!
