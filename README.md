# CUBI12

Cubi12 is (currently) an open source project to help students at UCN (Universidad Católica del Norte) at Chile to understand all the subjects they can take and their progress in the career. Also ships a auth system.

## Prerequisites

Before you begin, make sure you have the following software and tools installed on your system.

1. [Node](https://nodejs.org/en/blog/release/v18.17.1) version 18 or later.
2. npm version 9 or later (Normally shipped with Node).
3. Port 80 available.
4. [git](https://git-scm.com/) version 2.33 or later.

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. Clone the repository to your local machine.

2. Navigate to the root folder.
   ```bash
   cd frontend
   ```
3. Inside the folder exists a file called *.env.development* change their name to *.env* 

    **Note:** Change the value to match the API url, otherwise transactions will not work
    ```bash
    REACT_APP_API_URL=http://localhost:5000/api/
    ```

4. Install project dependencies using npm.
   ```bash
   npm install
   ```

## Running the App

To start the development server use the following command:

```bash
npm start
```

This will start the development server, and you can access the app in your web browser by visiting http://localhost:80.