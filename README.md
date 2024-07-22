# Get Folder Info
This project allows you to see what is in your server without connecting to it from the terminal or anywhere else. It has the capability to upload and download files and features both dark and light themes.

## Built With
* nodejs
* ejs
* css
* sqlite


## Getting Started
Follow these steps to set up the project locally:

### Prerequisites

Ensure you have Node.js and npm installed on your system.

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/farzaddm/Get-directory-info.git
   ```
2. **Install NPM packages:**
    ```sh
    npm install
    ```
3. **Run the project:**
   ```sh
    node app.js
   ```
4. **Set up Admin:**
   Go to `/setup` and setup admin account.

## Usage
To run the application on your server and keep it active indefinitely, consider using `tmux`. Access the application anytime by navigating to `http://serverIp:3026`.

## Features
- Upload and download files.
- Toggle between dark and light themes.
- Two types of user accessibility: admin and user.

## App Structure

```bash
myandpp
|__controller
|       |__directoryController.js           # Process path request
|       |__authController.js                # Login and logout functions
|       |__adminController.js               # Admin panel functions
|       |__setupController.js               # Functions for running site for first time(setting up admin)
|__database
|       |__database.js                      # Sqlite file and querys
|       |__database.db                      
|__doc
|__middleware                               
|       |__authMiddleware.js                # Middleware for checking authentications
|__public
|    |__pic                            
|    |   |__ligthBackground.jpg
|    |   |__darkBackground.jpg
|    |__style.css
|    |__favicon.ico
|__test
|    |__authController.test.js              # Unit test for authController.js
|__uploads                                  # Uploaded files will be in it
|__utils
|    |__getHashedPassword.js
|__views
|    |__admin
|    |      |__addUser.ejs
|    |      |__loginHistory.ejs
|    |      |__manageUsers.ejs
|    |__partilas
|    |      |__header.ejs
|    |      |__footer.ejs
|    |__file.ejs                            # Content of files will be shown on it
|    |__home.ejs                            # Root of system(list of directorys will be shown in it)                    
|    |__login.ejs
|    |__admin.ejs                           # Admin panel
|    |__setup.ejs                           # Will be shown first time that server runs                     
|__app.js                                   # Express server
|__README.md 
|__package-lock.json
|__package.json                                 
```

## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request.

### Note

Currently, the application uploads files to a specific folder named `uploads` in the root directory.