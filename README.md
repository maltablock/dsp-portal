# DSP Portal App

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Use `REACT_APP_USE_DEMO_DATA=true npm start` if you want to use demo data for packages list
(without any request to the real APIs).

Also you can use `npm run start:kylin` to run DSP portal on kylin testnet.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.information.

### `npm run deploy`

Builds and deploys the app on GCP. You need to have gcloud installed on your system
and also maltablock-access.json file placed in project root directory (it's git ignored).
Ask one of developers to provide you this file if neccessary.
